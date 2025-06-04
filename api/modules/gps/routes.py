""""""

from modules.log.logger import logger
from flask import Blueprint
from datetime import datetime
from gps import GPS

gps_routes = Blueprint("gps_routes", __name__, url_prefix="/api/gps")
gps = GPS()


@gps_routes.route("/location", methods=["GET"])
def get_location():
    try:
        logger.add_entry(
            {
                "performed_at": datetime.isoformat(datetime.now()),
                "action": "get location called",
            }
        )
        return {"response": "0.0000,0.0000"}
    except Exception as e:
        logger.add_entry(
            {
                "status": "Error getting location",
                "performed_at": datetime.isoformat(datetime.now()),
                "action": "get location",
            }
        )
        return {"error": f"error occured {str(e)}"}


@gps_routes.route("/stream")
def stream_location():
    try:
        logger.add_entry(
            {
                "performed_at": datetime.isoformat(datetime.now()),
                "action": "stream location called",
            }
        )
        return {"response": "unavailable"}
    except Exception as e:
        logger.add_entry(
            {
                "status": "Error getting location",
                "action": "stream location",
                "performed_at": datetime.isoformat(datetime.now()),
            }
        )
        return {"error": f"error occured {str(e)}"}
