import os
from os import path
from flask import Flask, flash, request, Response, jsonify
from flask_caching import Cache

from werkzeug.utils import secure_filename

from pysat.formula import CNF
from pysat.solvers import Solver

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

    if type(ls[0]) == list:
        return [ids2names(l) for l in ls]
    elif type(ls[0]) == int:
        return [mapping[abs(i)] for i in ls]
    else:
        raise ValueError(f"expected [int] or [[int]] but {ls}")


def names2ids(self, ls):

    mapping = self.backmap

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
        print(model)
        model = FmToPysat(model).transform()
        DimacsWriter(persname, model).transform()

    ident = path.basename(persname)
    ident = "abc"

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

    if (formula := cache.get(ident)) is None:
        return Response(f"key {ident} unknown", status = 404)

    with open(path.join(UPLOAD_FOLDER, ident)) as file:
        data = file.read()

    return Response(data, status = 200)


@app.route('/analysis/sat/<ident>', defaults = dict(raw = False), methods = ["POST"])
@app.route('/analysis/sat/<ident>/raw', defaults = dict(raw = True), methods = ["POST"])
def verify_config(ident, raw = True):
    data = request.get_json()
    
    if (formula := cache.get(ident)) is None:
        print(ident, "unknown")
        return Response(f"key {ident} unknown", status = 404)

    formula.ids2names = ids2names.__get__(formula)
    formula.names2ids = names2ids.__get__(formula)

    config = data.get("config", None)

    if config is None or type(config) != list:
        return Response(f"{config} is not a valid configuration ([int] required)")

    if not raw:
        config = formula.names2ids(config)
        print(config)

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
    data = request.get_json()
    config = data.get("config", None)

    if (formula := cache.get(ident)) is None:
        print(ident, "unknown")
        return Response(f"key {ident} unknown", status = 404)

    formula.ids2names = ids2names.__get__(formula)
    formula.names2ids = names2ids.__get__(formula)

    if config is None or type(config) != list:
        return Response(f"{config} is not a valid configuration ([int] required)")

    if not raw:
        config = formula.names2ids(config)

    if (solver := solvers.get(ident)) is None:
        solver = Solver(bootstrap_with = formula)

    simp = {x for x in range(1, formula.nv + 1) if not solver.solve(temp_config(config, -x))}.difference(config)
    dimp = {x for x in range(1, formula.nv + 1) if not solver.solve(temp_config(config, x))}.difference(config)

    free = set(range(1, formula.nv + 1)).difference(simp).difference(dimp)

    simp = sorted(simp)
    dimp = sorted(dimp)
    free = sorted(free)

    if not raw:
        simp = formula.ids2names(simp)
        dimp = formula.ids2names(dimp)
        free = formula.ids2names(free)

    data = dict(implicit_selected = simp, implicit_deselected = dimp, free = free)

    return jsonify(data), 200


@app.route('/analysis/deadcore/<ident>', defaults = dict(raw = False), methods = ["POST"])
@app.route('/analysis/deadcore/<ident>/raw', defaults = dict(raw = True), methods = ["POST"])
@cache.cached()
def deadcore(ident, raw = True):
    if (formula := cache.get(ident)) is None:
        print(ident, "unknown")
        return Response(f"key {ident} unknown", status = 404)

    formula.ids2names = ids2names.__get__(formula)
    formula.names2ids = names2ids.__get__(formula)

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

    if not raw:
        cores = formula.ids2names(cores)
        deads = formula.ids2names(deads)

    data = {
        "cores": sorted(cores),
        "deads": sorted(deads)
    }

    return jsonify(data), 200