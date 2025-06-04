""""""

from dotenv import dotenv_values
from api.modules.led.led import LED
from flask_cors import CORS
from flask import Flask, request
from collections import OrderedDict

# prepare the relevant items
# prepare the env configuration files
# prepare the flask application
# open the flask server to cors and allow access from anywhere
config = dotenv_values(".env")
led = LED(17, config["LOG"])
app = Flask(__name__)
CORS(app, supports_credentials=False, resources={r"/*": {"origins": ["*"]}})


@app.route("/api/led/status/")
def get_led_status():
    r = led.is_on
    return {"response": {"status": r}}


# server api routes for making actions on the led class
@app.route("/api/led/blink/")
def blink_lights():
    """Blinks the light, limited by duration parameter
    (e.g. http://localhost/api/led/blink?duration=3)
    """
    dur = int(request.args.get("duration") or 3)

    r = led.blink_lights(dur)
    return {"response": r}


@app.route("/api/led/on/")
def turn_led_on():
    r = led.turn_on()
    return {"response": r}


@app.route("/api/led/off/")
def turn_led_off():
    r = led.turn_off()
    return {"response": r}


@app.route("/api/led/logs/")
def get_log():
    """Returns the log as a JSON object, limited by limit parameter
    (e.g. http://localhost/api/led/logs?limit=50)
    """
    num = int(request.args.get("limit") or 60)

    # the log returns a list of JSON objects, but must be a single JSON object
    lst = led.get_led_logs(num)

    # create OrderedDict to preserve time order of elements
    # since each log entry must have a top-level key in the wrapper JSON object
    # that will be the created_at value, which also remains inside the object
    od = OrderedDict()
    for d in lst:
        od[d["created_at"]] = d

    return lst


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
