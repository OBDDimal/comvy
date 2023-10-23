# comvy: Built-In Backend

Simple analysis backend built with [Flask](https://flask.palletsprojects.com) and [Flask-Caching](https://flask-caching.readthedocs.io).

## Routes
### Registering and Lookup

* `/register_formula`: Register a formula in DIMACS or FeatureIDE XML format
    * Returns `417` when the file is neither a valid DIMACS nor a valid FeatureIDE XML
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

### Analysis

> Feature names can be used instead of variable ids by omitting `/raw`, returns will then use feature names as well


* `/analysis/sat/<ident>/raw`: Verify a (partial) configuration

    **In**: (partial) configuration in JSON

    **Returns**:

    * `404` if `ident` is invalid
    * `417` if the (partial) configuration is invalid (e.g., `/raw`)
    * `200` and a JSON

    **Example**:
    ```
    > curl -X POST localhost:5000/verify/<ident> -H 'Content-Type: application/json' -d '{"config":[1, 2, 3]}'

    {"valid": True, "solution": [1,2,3,...]}  # if config is valid
    {"valid": False, "refutation": [1,2,3]}   # if config is invalid
    ```

* `/analysis/dp/<ident>/raw`: Compute decision propagation for a (partial) configuration

    **In**: (partial) configuration in JSON

    **Returns**:

    * `404` if `ident` is invalid
    * `417` if the (partial) configuration is invalid (e.g., `/raw`)
    * `200` and a JSON containing a validity decision and sets of free, implicit selected, and implicit deselected variables 

    **Example**:
    ```
    > curl -X POST localhost:5000/verify/<ident> -H 'Content-Type: application/json' -d '{"config":[1, 2, 3]}

    {"valid": True, free": [..], "implicit_selected": [..], "implicit_deselected": [..]}  # if config is valid
    {"valid": False}                                                                      # if config is invalid
    ```

* `/analysis/deadcore/<ident>/raw`: Compute dead and core variables of the formula
    
    **Returns**:
    
    * `404` if `ident` is invalid
    * `200` and a JSON containing sets of dead and core variables

    **Example**:
    ```
    > curl -X POST localhost:5000/analysis/deadcore/<ident>

    {"deads": [..], "cores": [..]}
    ```

* `/analysis/count_approx/<ident>/raw`: Count the approximate number of configurations

    **In**:

    * [optional] Partial configuration as JSON (default: [])

    **Returns**:

    * `404` if `ident` is invalid
    * `417` if the (partial) configuration is invalid (e.g., `/raw`)
    * `200` and a JSON containing the approximate number of configurations

    **Example**:
    ```
    > curl -i -X POST localhost:5000/analysis/count_approx/<ident>/raw -H 'Content-Type: application/json' -d '{"config":[42]}

    {"ssat": <count>}
    ```

* `/analysis/commonality_approx/<ident>/raw`: Count the approximate commonality of variables

    **In**:

    * [optional] Partial configuration as JSON (default: [])
    * [optional] List of variables to compute the commonality for (default: all)

    **Returns**:

    * `404` if `ident` is invalid
    * `417` if the (partial) configuration or the variable list are invalid (e.g., `/raw`)
    * `200` and a JSON containing the approximate number of configurations

    **Example**:
    ```
    > curl -i -X POST localhost:5000/analysis/commonality_approx/<ident>/raw -H 'Content-Type: application/json' -d '{"config":[42], "variables":[1, 2]}

    {"1": <commonality of variable 1>, "2": <commonality of variable 2>}
    ```
