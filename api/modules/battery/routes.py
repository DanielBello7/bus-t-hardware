""""""

from api.modules.log.logger import logger
from flask import Blueprint
from datetime import datetime
from battery import Battery

battery_routes = Blueprint("battery_routes", __name__, url_prefix="/api/battery")
battery = Battery(17)


@battery_routes.route("/level")
def get_location():
    try:
        logger.add_entry(
            {
                "performed_at": datetime.isoformat(datetime.now()),
                "action": "get battery level called",
            }
        )
        return {"response": 0}
    except Exception as e:
        logger.add_entry(
            {
                "status": "Error getting battery level",
                "action": "get battery",
                "performed_at": datetime.isoformat(datetime.now()),
            }
        )
        return {"error": f"error occured {str(e)}"}
