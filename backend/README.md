# comvy: Built-In Backend

Simple analysis backend built with [Flask](https://flask.palletsprojects.com) and [Flask-Caching](https://flask-caching.readthedocs.io).

## Routes

* `/register_formula`: Register a formula in DIMACS format 
    * Returns `417` when the file is not valid DIMACS
    * Returns `422` if no file is supplied
    * Returns `200` and key `ident` for further actions on the formula
   > Example: `curl -i -X POST -F file=@<file> localhost:5000/register_formula`
   > 
   > HTTP/1.1 200 OK
   > 
   > tmpa6nz31px

* `/view_formula/<ident>`: View the DIMACS of a registered formula
    * Returns `404` if `ident` is invalid
    * Returns `200` and raw content of the DIMACS file

* `/analysis/sat/<ident> `: Verify a (partial) configuration as JSON
    * Returns `404` if `ident` is invalid
    * Returns `200` and a JSON
   > Example: `curl -X POST localhost:5000/verify/<ident> -H 'Content-Type: application/json' -d '{"config":[1, 2, 3]}'`
   > 
   > `{"valid": True, "solution": [1,2,3,...]}`  # if [1,2,3] is a valid partial configuration
   > 
   > `{"valid": False, "refutation": [1,2,3]}`  # if [1,2,3] is an invalid partial configuration

* `/analysis/dp/<ident> `: Compute decision propagation of a (partial) configuration supplied as JSON
    * Returns `404` if `ident` is invalid
    * Returns `200` and a JSON containing sets of free, implicit selected, and implicit deselected variables

   > Example: `curl -X POST localhost:5000/verify/<ident> -H 'Content-Type: application/json' -d '{"config":[1, 2, 3]}'
   > 
   > `{"free": [..], "implicit_selected": [..], "implicit_deselected": [..]}`

* `/analysis/deadcore/<ident> `: Compute dead and core variables of the formula
    * Returns `404` if `ident` is invalid
    * Returns `200` and a JSON containing sets of dead and core variables

   > Example: `curl -X POST localhost:5000/analysis/deadcore/<ident>`
   > 
   > `{"deads": [..], "cores": [..]}`



