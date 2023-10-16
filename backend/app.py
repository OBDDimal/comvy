import os
from os import path
from flask import Flask, flash, request, Response, jsonify
from flask_caching import Cache

from werkzeug.utils import secure_filename

from pysat.formula import CNF
from pysat.solvers import Solver

from tempfile import NamedTemporaryFile

from copy import copy

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

    try:
        formula = CNF(from_file = persname)
        solvers[ident] = Solver(bootstrap_with = formula)

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


@app.route('/analysis/sat/<ident>', methods = ["POST"])
def verify_config(ident):
    data = request.get_json()

    if (formula := cache.get(ident)) is None:
        print(ident, "unknown")
        return Response(f"key {ident} unknown", status = 404)

    config = data.get("config", None)

    if config is None or type(config) != list:
        return Response(f"{config} is not a valid configuration ([int] required)")

    if (solver := solvers.get(ident)) is None:
        solver = Solver(bootstrap_with = formula)

    if solver.solve(config):
        data = dict(valid = True, solution = solver.get_model())
    else:        
        data = dict(valid = False, refutation = solver.get_core())

    return jsonify(data), 200


def temp_config(config, x):
    config = copy(config)
    config.append(x)

    return config


@app.route('/analysis/dp/<ident>', methods = ["POST"])
def dp(ident):
    data = request.get_json()
    config = data.get("config", None)

    if config is None or type(config) != list:
        return Response(f"{config} is not a valid configuration ([int] required)")

    if (formula := cache.get(ident)) is None:
        print(ident, "unknown")
        return Response(f"key {ident} unknown", status = 404)

    if (solver := solvers.get(ident)) is None:
        solver = Solver(bootstrap_with = formula)

    simp = {x for x in range(1, formula.nv + 1) if not solver.solve(temp_config(config, -x))}.difference(config)
    dimp = {x for x in range(1, formula.nv + 1) if not solver.solve(temp_config(config, x))}.difference(config)

    free = set(range(1, formula.nv + 1)).difference(simp).difference(dimp)
    data = dict(implicit_selected = sorted(simp), implicit_deselected = sorted(dimp), free = sorted(free))

    return jsonify(data), 200


@app.route('/analysis/deadcore/<ident>', methods = ["POST"])
@cache.cached()
def deadcore(ident):
    if (formula := cache.get(ident)) is None:
        print(ident, "unknown")
        return Response(f"key {ident} unknown", status = 404)

    if (solver := solvers.get(ident)) is None:
        solver = Solver(bootstrap_with = formula)

    found = set()

    dead = set()
    core = set()

    
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
                dead.add(x)

        if not nx_found:
            if solver.solve([-x]):
                for y in solver.get_model():
                    found.add(y)
            else:
                solver.add_clause([x])
                core.add(x)

    data = {
        "cores": sorted(core),
        "deads": sorted(dead)
    }

    return jsonify(data), 200
