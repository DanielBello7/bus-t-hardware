""""""

from flask import Blueprint, jsonify
from datetime import datetime
from inspect import currentframe
from modules.log.logger import logger
from .adc_ads1115 import ADC_ADS1115

adc_ads1115_routes = Blueprint(
    "adc_ads1115_routes", __name__, url_prefix="/api/ads1115"
)
battery = ADC_ADS1115()


# helper function to add message into the logger
def insert_msg(msg):
    logger.add_entry(
        {
            "status": msg,
            "action": currentframe().f_back.f_code.co_name,
            "performed_at": datetime.utcnow().isoformat() + "Z",
        }
    )


@adc_ads1115_routes.route("/start", methods=["GET"])
def start():
    global battery

    try:
        data = battery.listen()

        if not data.get("result"):
            raise Exception(data.get("error", "unknown error when listening"))

        insert_msg("started ads1115 listening")
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": f"error occured: {error}"}), 400


@adc_ads1115_routes.route("/level", methods=["GET"])
def level():
    global battery

    try:
        data = battery.percentage()

        if not data.get("result"):
            raise Exception(data.get("error", "unknown error when getting percentage"))

        insert_msg("retrieved ads1115 battery level")
        return jsonify({"response": data.get("result", data)}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": f"error occured: {error}"}), 400


@adc_ads1115_routes.route("/pause", methods=["GET"])
def pause():
    global battery

    try:
        data = battery.stop_listen()

        if not data.get("result"):
            raise Exception(data.get("error", "unknown error when pausing"))

        insert_msg("paused ads1115 listening")
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": f"error occured: {error}"}), 400


""""""
