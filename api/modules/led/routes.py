""""""

from flask import request, Blueprint, jsonify
from modules.log.logger import logger
from .led import LED
from datetime import datetime
from inspect import currentframe


led_routes = Blueprint("led_routes", __name__, url_prefix="/api/led")
led = LED(17)


# helper function to add message into the logger
def insert_msg(msg):
    logger.add_entry(
        {
            "status": msg,
            "action": currentframe().f_back.f_code.co_name,
            "performed_at": datetime.utcnow().isoformat() + "Z",
        }
    )


# server api routes for making actions on the led class
# turn off the lights
@led_routes.route("/off/", methods=["GET"])
def turn_led_off():
    try:
        r = led.turn_off()

        if not r.get("result"):
            raise Exception(r.get("error", "unknown error when turning led off"))

        insert_msg("turning off the led")
        return jsonify({"response": r}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": f"error occured: {error}"}), 400


# turn on the lights
@led_routes.route("/on/", methods=["GET"])
def turn_led_on():
    try:
        r = led.turn_on()

        if not r.get("result"):
            raise Exception(r.get("error", "unknown error when turning led on"))

        insert_msg("turning on the led")
        return jsonify({"response": r}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": f"error occured: {error}"}), 400


# get the current status of the lights
@led_routes.route("/status/", methods=["GET"])
def index():
    try:
        r = led.is_on

        if not r.get("result"):
            raise Exception(r.get("error", "unknown error when getting led status"))

        insert_msg("getting led status")
        return jsonify({"response": r}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": f"error occured: {error}"}), 400


# blink the lights
@led_routes.route("/blink/", methods=["GET"])
def blink_lights():
    try:
        """Blinks the light, limited by duration parameter
        (e.g. http://localhost/api/led/blink?duration=3)
        """
        dur = int(request.args.get("duration") or 3)

        r = led.blink_lights(dur)

        if not r.get("result"):
            raise Exception(r.get("error", "unknown error when blinking led"))

        insert_msg("blinking led lights")
        return jsonify({"response": r}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": f"error occured: {error}"}), 400
