""""""

from modules.log.logger import logger
from flask import Blueprint
from datetime import datetime
from .adc_mcp3008 import ADC_MCP3008

battery_routes = Blueprint("battery_routes", __name__, url_prefix="/api/battery")
battery = ADC_MCP3008(17)


# helper function to add message into the logger
def insert_msg(msg, sts):
    logger.add_entry(
        {
            "status": sts,
            "action": msg,
            "performed_at": datetime.isoformat(datetime.now()),
        }
    )


@battery_routes.route("/level", methods=["GET"])
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
