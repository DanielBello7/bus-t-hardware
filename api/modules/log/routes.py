""""""

from flask import Blueprint, request, jsonify  # type:ignore
from .logger import logger
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
    pge = int(request.args.get("page", 1))
    offset = (pge - 1) * num

    # the log returns a list of JSON objects, but must be a single JSON object
    all_logs = logger.get_log(num)
    total = len(all_logs)

    paginated_logs = all_logs[offset : offset + num]

    # create OrderedDict to preserve time order of elements
    # since each log entry must have a top-level key in the wrapper JSON object
    # that will be the created_at value, which also remains inside the object
    od = OrderedDict()
    for d in paginated_logs:
        od[d["created_at"]] = d

    return (
        jsonify(
            {
                "docs": paginated_logs,
                "total": total,
                "limit": num,
                "page": pge,
                "pages": (total + num - 1) // num,  # total number of pages
            }
        ),
        200,
    )
