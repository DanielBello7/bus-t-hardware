""""""

from modules.log.logger import logger
from flask import Blueprint, jsonify  # type: ignore
from datetime import datetime
from .adc_mcp3008 import ADC_MCP3008
from inspect import currentframe

adc_mcp3008_routes = Blueprint(
    "adc_mcp3008_routes", __name__, url_prefix="/api/mcp3008"
)
battery = ADC_MCP3008()


# helper function to add message into the logger
def insert_msg(msg):
    logger.add_entry(
        {
            "status": msg,
            "action": currentframe().f_back.f_code.co_name,
            "performed_at": datetime.utcnow().isoformat() + "Z",
        }
    )


@adc_mcp3008_routes.route("/level/", methods=["GET"])
def get_level():
    global battery

    try:
        response = battery.percentage()
        if not response.get("result"):
            raise Exception(response.get("error", "unknown error"))

        insert_msg("get battery level called")
        return jsonify({"response": response["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": error}), 400


@adc_mcp3008_routes.route("/start/", methods=["GET"])
def start_reading():
    global battery

    try:
        response = battery.listen()
        if not response.get("result"):
            raise Exception(response.get("error", "unknown error"))

        insert_msg("start reading battery level")
        return jsonify({"response": response["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": error}), 400


@adc_mcp3008_routes.route("/pause/", methods=["GET"])
def stop_reading():
    global battery

    try:
        response = battery.stop_listen()
        if not response.get("result"):
            raise Exception(response.get("error", "unknown error"))

        insert_msg("stop reading battery level")
        return jsonify({"response": response["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": error}), 400


""""""
