import os
from os import path
from flask import Flask, flash, request, Response, jsonify
from flask_caching import Cache

from werkzeug.utils import secure_filename

from pysat.formula import CNF
from pysat.solvers import Solver

from pysat.allies.approxmc import Counter

from tempfile import NamedTemporaryFile

from copy import copy
import re

from flamapy.metamodels.fm_metamodel.transformations import FeatureIDEReader
from flamapy.metamodels.pysat_metamodel.transformations import FmToPysat, DimacsWriter

UPLOAD_FOLDER = '/tmp/'

cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = os.urandom(32)

cache.init_app(app)

solvers = dict()


@app.route('/', methods = ["GET", "POST"])
def index():
    return Response("Flask Analysis Backend Running", status = 200)

def get_variable_mapping(formula):

    mapping = dict()
    backmap = dict()
    p = re.compile(r"c\s+(?P<id>\d+)\s+(?P<name>.+)")

    for comment in formula.comments:
        comment = comment.strip()
        if m := p.match(comment):
            mapping[int(m["id"])] = m["name"]
            backmap[m["name"]] = int(m["id"])
        else:
            raise ValueError(f"malformed comment: \"{comment}\"")

    return mapping, backmap

def ids2names(self, ls):

    mapping = self.mapping

    if len(ls) == 0:
        return ls

    if type(ls[0]) == list:
        return [ids2names(l) for l in ls]
    elif type(ls[0]) == int:
        return [mapping[abs(i)] for i in ls]
    else:
        raise ValueError(f"expected [int] or [[int]] but {ls}")


def names2ids(self, ls):

    mapping = self.backmap

    if len(ls) == 0:
        return ls

    if type(ls[0]) == list:
        return [names2ids(l) for l in ls]
    elif type(ls[0]) == str:

        xs = []

        for feat in ls:
            if feat.startswith("!"):
                x = -mapping[feat[1:]]
            else:
                x = mapping[feat]

            xs.append(x)

        return xs
    else:
        raise ValueError(f"expected [str] or [[str]] but {ls}")


@app.route('/register_formula', methods = ["POST"])
def register_file():
    if "file" not in request.files:
        flash("no file supplied")
        return Response("no file supplied", status = 422)

    file = request.files["file"]

    if not file or file.filename == "":
        flash("no file supplied")
        return Response("no file supplied", status = 422)

    filename = secure_filename(file.filename)
    _, ext = path.splitext(filename)

    persname = NamedTemporaryFile(dir = UPLOAD_FOLDER).name
    file.save(persname)

    if ext == ".xml":
        model = FeatureIDEReader(persname).transform()
        model = FmToPysat(model).transform()
        DimacsWriter(persname, model).transform()

    ident = path.basename(persname)

    try:
        formula = CNF(from_file = persname)
        solvers[ident] = Solver(bootstrap_with = formula)

        m, b = get_variable_mapping(formula)

        formula.mapping = m
        formula.backmap = b
        
        cache.set(f"{ident}", formula)

        return Response(ident, status = 200)
    except ValueError:
        return Response("invalid CNF", status = 417)


@app.route('/view_formula/<ident>', methods = ["GET", "POST"])
def view_formula(ident):

    with open(path.join(UPLOAD_FOLDER, ident)) as file:
        data = file.read()

    return Response(data, status = 200)


@app.route('/analysis/sat/<ident>', defaults = dict(raw = False), methods = ["POST"])
@app.route('/analysis/sat/<ident>/raw', defaults = dict(raw = True), methods = ["POST"])
def verify_config(ident, raw = True):

    data = assure_json(request)

    formula, r = assure_formula(ident)
    if formula is None:
        return r

    config, r = assure_config(config, formula, raw)
    if config is None:
        return r

    if (solver := solvers.get(ident)) is None:
        solver = Solver(bootstrap_with = formula)

    if solver.solve(config):
        if raw:
            data = dict(valid = True, solution = solver.get_model())
        else:
            data = dict(valid = True, solution = formula.ids2names(solver.get_model()))
    else:        
        if raw:
            data = dict(valid = False, refutation = solver.get_core())
        else:
            data = dict(valid = False, refutation = formula.ids2names(solver.get_core()))

    return jsonify(data), 200


def temp_config(config, x):
    config = copy(config)
    config.append(x)

    return config

@app.route('/analysis/dp/<ident>', defaults = dict(raw = False), methods = ["POST"])
@app.route('/analysis/dp/<ident>/raw', defaults = dict(raw = True), methods = ["POST"])
def dp(ident, raw = True):

    data = assure_json(request)
    config = data.get("config", None)

    formula, r = assure_formula(ident)
    if formula is None:
        return r
    
    config, r = assure_config(config, formula, raw)
    if config is None:
        return r

    if (solver := solvers.get(ident)) is None:
        solver = Solver(bootstrap_with = formula)

    simp = {x for x in range(1, formula.nv + 1) if not solver.solve(temp_config(config, -x))}.difference(config)
    dimp = {x for x in range(1, formula.nv + 1) if not solver.solve(temp_config(config, x))}.difference(config)

    if not simp.isdisjoint(dimp):
        data = dict(valid = False)
        return jsonify(data), 200

    free = set(range(1, formula.nv + 1)).difference(simp).difference(dimp)

    simp = sorted(simp)
    dimp = sorted(dimp)
    free = sorted(free)

    if not raw:
        simp = formula.ids2names(simp)
        dimp = formula.ids2names(dimp)
        free = formula.ids2names(free)

    data = dict(valid = True, implicit_selected = simp, implicit_deselected = dimp, free = free)

    return jsonify(data), 200


@app.route('/analysis/deadcore/<ident>', defaults = dict(raw = False), methods = ["POST"])
@app.route('/analysis/deadcore/<ident>/raw', defaults = dict(raw = True), methods = ["POST"])
@cache.cached()
def deadcore(ident, raw = True):
    
    formula, r = assure_formula(ident)
    if formula is None:
        return r

    if (solver := solvers.get(ident)) is None:
        solver = Solver(bootstrap_with = formula)

    found = set()

    deads = set()
    cores = set()
    
    for x in range(1, formula.nv + 1):
        x_found = x in found
        nx_found = -x in found

        if x_found and nx_found:
            continue

        if not x_found:
            if solver.solve([x]):
                for y in solver.get_model():
                    found.add(y)
            else:
                solver.add_clause([-x])
                deads.add(x)

        if not nx_found:
            if solver.solve([-x]):
                for y in solver.get_model():
                    found.add(y)
            else:
                solver.add_clause([x])
                cores.add(x)

    cores = sorted(cores)
    deads = sorted(deads)

    if not raw:
        cores = formula.ids2names(cores)
        deads = formula.ids2names(deads)

    data = {
        "cores": cores,
        "deads": deads
    }

    return jsonify(data), 200

@app.route('/analysis/count_approx/<ident>', defaults = dict(raw = False), methods = ["POST"])
@app.route('/analysis/count_approx/<ident>/raw', defaults = dict(raw = True), methods = ["POST"])
def count_approx(ident, raw):

    data = assure_json(request)
    config = data.get("config", None)

    formula, r = assure_formula(ident)
    if formula is None:
        return r

    config, r = assure_config(config, formula, raw)
    if config is None:
        return r

    with Counter(formula) as counter:
        if config:
            counter.add_clause(config)

        data = dict(ssat = counter.count())

    return jsonify(data, 200)


def assure_formula(ident):
    formula = cache.get(ident)

    if formula is None:
        return None, Response(f"key {ident} unknown", status = 404)

    formula.ids2names = ids2names.__get__(formula)
    formula.names2ids = names2ids.__get__(formula)

    return formula, None


def assure_config(config, formula, raw):

    if config is None:
        return [], None

    if type(config) == list:
        if len(config) == 0:
            return [], None

        if raw:
            if (t := type(config[0])) != int:
                return None, Response(f"{config} not of type [int] but [{t}] and /raw", status = 417)
        else:
            if (t := type(config[0])) != str:
                return None, Response(f"{config} not of type [str] but [{t}] and not /raw", status = 417)

            config = formula.names2ids(config)

    return config, None


def assure_variables(variables, formula, raw, none_to_all = False):

    if variables is None:
        if none_to_all:
            return range(1, formula.nv + 1), None
        else:
            return [], None

    if type(variables) == list:
        if len(variables) == 0:
            return [], None

        if raw:
            if (t := type(variables[0])) != int:
                return None, Response(f"{variables} not of type [int] but [{t}] and /raw", status = 417)
        else:
            if (t := type(variables[0])) != str:
                return None, Response(f"{variables} not of type [str] but [{t}] and not /raw", status = 417)

            variables = formula.names2ids(variables)

    return variables, None


def assure_json(request):

    if request.headers.get("CONTENT_TYPE", "") == 'application/json':
        return request.get_json()

    return dict()


@app.route('/analysis/commonality_approx/<ident>', defaults = dict(raw = False), methods = ["POST"])
@app.route('/analysis/commonality_approx/<ident>/raw', defaults = dict(raw = True), methods = ["POST"])
def commonality_approx(ident, raw = True):

    data = assure_json(request)

    config = data.get("config", None)
    variables = data.get("variables", None)

    formula, r = assure_formula(ident)
    if formula is None:
        return r

    config, r = assure_config(config, formula, raw)
    if config is None:
        return r

    variables, r = assure_variables(variables, formula, raw, none_to_all = True)
    if variables is None:
        return r

    data = dict()

    for x in variables:
        with Counter(formula) as counter:
            if config:
                counter.add_clause(config)
            
            counter.add_clause([x])
            count = counter.count()

        if raw:
            data[x] = count
        else:
            data[formula.mapping[x]] = count

    return jsonify(data, 200)