""""""

from flask import request, Blueprint
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
            "status": led.is_on,
            "performed_at": datetime.isoformat(datetime.now()),
            "action": msg,
        }
    )


# server api routes for making actions on the led class
# turn off the lights
@led_routes.route("/off/", methods=["GET"])
def turn_led_off():
    try:
        r = led.turn_off()
        insert_msg(currentframe().f_code.co_name)
        return {"response": r}
    except Exception as e:
        insert_msg(f"Error trying to turn lights off: {str(e)}")
        return {"error": f"error occured: {str(e)}"}


# turn on the lights
@led_routes.route("/on/", methods=["GET"])
def turn_led_on():
    try:
        r = led.turn_on()
        insert_msg(currentframe().f_code.co_name)
        return {"response": r}
    except Exception as e:
        insert_msg(f"Error trying to turn lights on {str(e)}")
        return {"error": f"error occured: {str(e)}"}


# get the current status of the lights
@led_routes.route("/status/", methods=["GET"])
def index():
    try:
        r = led.is_on
        insert_msg(currentframe().f_code.co_name)
        return {"response": {"status": r}}
    except Exception as e:
        insert_msg(f"Error occured trying to get status of lights: {str(e)}")
        return {"error": f"error occured: {str(e)}"}


# blink the lights
@led_routes.route("/blink/", methods=["GET"])
def blink_lights():
    try:
        """Blinks the light, limited by duration parameter
        (e.g. http://localhost/api/led/blink?duration=3)
        """
        dur = int(request.args.get("duration") or 3)

        r = led.blink_lights(dur)
        insert_msg(currentframe().f_code.co_name)
        return {"response": r}
    except Exception as e:
        insert_msg(f"Error occured trying to blink lights: {str(e)}")
        return {"error": f"error occured: {str(e)}"}
