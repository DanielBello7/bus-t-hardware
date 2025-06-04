""""""

from flask import Blueprint, request
from logger import logger
from collections import OrderedDict

logger_routes = Blueprint("logger_routes", __name__, url_prefix="/api/logs")


# server api routes for making actions on the log class
# get the current logs
@logger_routes.route("/", methods=["GET"])
def index():
    """Returns the log as a JSON object, limited by limit parameter
    (e.g. http://localhost/api/led/logs?limit=50)
    """
    num = int(request.args.get("limit") or 60)

    # the log returns a list of JSON objects, but must be a single JSON object
    lst = logger.get_led_logs(num)

    # create OrderedDict to preserve time order of elements
    # since each log entry must have a top-level key in the wrapper JSON object
    # that will be the created_at value, which also remains inside the object
    od = OrderedDict()
    for d in lst:
        od[d["created_at"]] = d

    return lst
