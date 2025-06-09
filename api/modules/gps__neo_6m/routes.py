""""""

from modules.log.logger import logger
from flask import Blueprint, jsonify
from datetime import datetime
from inspect import currentframe
from .gps_neo_6m import GPS_NEO_6M

gps_routes = Blueprint("gps_routes", __name__, url_prefix="/api/gps")
gps = GPS_NEO_6M()


# helper function to add message into the logger
def insert_msg(msg, sts):
    logger.add_entry(
        {
            "status": sts,
            "action": msg,
            "performed_at": datetime.isoformat(datetime.now()),
        }
    )


@gps_routes.route("/location", methods=["GET"])
def get_location():
    global gps

    try:
        data = gps.get_current_location()
        if not data.get("result"):
            raise Exception(data.get("error", "unknown error during get location"))

        insert_msg("get location called", currentframe().f_code.co_name)
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error, currentframe().f_code.co_name)
        return jsonify({"error": f"error occurred: {str(e)}"}), 400


@gps_routes.route("/last_saved", methods=["GET"])
def get_last_saved():
    global gps

    try:
        data = gps.get_last_location()
        if not data.get("result"):
            raise Exception(data.get("error", "unknown error during get last saved"))

        insert_msg("get location called", currentframe().f_code.co_name)
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error, currentframe().f_code.co_name)
        return jsonify({"error": f"error occurred: {str(e)}"}), 400


@gps_routes.route("/stream", methods=["GET"])
def stream_location():
    global gps

    try:
        data = gps.stream_location()
        if not data.get("result"):
            raise Exception(data.get("error", "unknown error during stream"))

        insert_msg("stream location called", currentframe().f_code.co_name)
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error, currentframe().f_code.co_name)
        return jsonify({"error": f"error occurred: {str(e)}"}), 400


@gps_routes.route("/cancel_stream", methods=["GET"])
def stop_streaming():
    global gps

    try:
        data = gps.cancel_stream()
        if not data.get("result"):
            raise Exception(data.get("error", "unknown error occurred"))

        insert_msg("streaming canceled", currentframe().f_code.co_name)
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error, currentframe().f_code.co_name)
        return jsonify({"error": f"error occurred: {str(e)}"}), 400


@gps_routes.route("/status", methods=["GET"])
def streaming_status():
    global gps

    try:
        data = gps.get_streaming_status()

        if not data.get("result"):
            raise Exception(data.get("error", "undefined error"))

        insert_msg("status called", currentframe().f_code.co_name)
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error, currentframe().f_code.co_name)
        return jsonify({"error": f"error occurred: {str(e)}"}), 400
