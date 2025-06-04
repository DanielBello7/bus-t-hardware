""""""

from flask_cors import CORS
from flask import Flask
from api.modules.battery.routes import battery_routes
from api.modules.gps.routes import gps_routes
from api.modules.led.routes import led_routes
from api.modules.log.routes import logger_routes
from api.modules.nfc.routes import nfc_routes

# prepare the relevant items
# prepare the env configuration files
# prepare the flask application
# open the flask server to cors and allow access from anywhere
app = Flask(__name__)
CORS(app, supports_credentials=False, resources={r"/*": {"origins": ["*"]}})


app.register_blueprint(battery_routes)
app.register_blueprint(gps_routes)
app.register_blueprint(led_routes)
app.register_blueprint(logger_routes)
app.register_blueprint(nfc_routes)


@app.route("/ping")
def ping():
    return {"response": "ping"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5500)
