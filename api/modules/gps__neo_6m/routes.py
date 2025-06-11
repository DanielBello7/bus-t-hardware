""""""

from modules.log.logger import logger
from flask import Blueprint, jsonify  # type: ignore
from datetime import datetime
from inspect import currentframe
from .gps_neo_6m import GPS_NEO_6M

gps_routes = Blueprint("gps_routes", __name__, url_prefix="/api/gps")
gps = GPS_NEO_6M()


# helper function to add message into the logger
def insert_msg(msg):
    logger.add_entry(
        {
            "status": msg,
            "action": currentframe().f_back.f_code.co_name,
            "performed_at": datetime.utcnow().isoformat() + "Z",
        }
    )


@gps_routes.route("/location/", methods=["GET"])
def get_location():
    global gps

    try:
        data = gps.get_current_location()
        if not data.get("result"):
            raise Exception(data.get("error", "unknown error during get location"))

        insert_msg("getting current location")
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": f"error occurred: {error}"}), 400


@gps_routes.route("/last_saved/", methods=["GET"])
def get_last_saved():
    global gps

    try:
        data = gps.get_last_location()
        if not data.get("result"):
            raise Exception(data.get("error", "unknown error during get last saved"))

        insert_msg("getting last saved location")
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": f"error occurred: {error}"}), 400


@gps_routes.route("/stream/", methods=["GET"])
def stream_location():
    global gps

    try:
        data = gps.stream_location()
        if not data.get("result"):
            raise Exception(data.get("error", "unknown error during stream"))

        insert_msg("streaming location")
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": f"error occurred: {error}"}), 400


@gps_routes.route("/cancel_stream/", methods=["GET"])
def stop_streaming():
    global gps

    try:
        data = gps.cancel_stream()
        if not data.get("result"):
            raise Exception(data.get("error", "unknown error occurred"))

        insert_msg("streaming canceled")
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": f"error occurred: {error}"}), 400


@gps_routes.route("/status/", methods=["GET"])
def streaming_status():
    global gps

    try:
        data = gps.get_streaming_status()
        if not data.get("result"):
            raise Exception(data.get("error", "undefined error"))

        insert_msg("getting streaming status")
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": f"error occurred: {error}"}), 400
