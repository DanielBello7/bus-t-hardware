""""""

from flask import Blueprint, request, jsonify  # type: ignore
from modules.log.logger import logger
from datetime import datetime
from inspect import currentframe
from .nfc_pn532 import NFC_PN532

nfc_pn532_routes = Blueprint("nfc_pn532_routes", __name__, url_prefix="/api/pn532")
nfc = NFC_PN532(timeout=4.0)


# helper function to add message into the logger
def insert_msg(msg):
    logger.add_entry(
        {
            "status": msg,
            "action": currentframe().f_back.f_code.co_name,
            "performed_at": datetime.utcnow().isoformat() + "Z",
        }
    )


@nfc_pn532_routes.route("/stats/", methods=["GET"])
def get_hat_status():
    global nfc

    try:
        is_busy = nfc.is_busy
        insert_msg(f"reading nfc status: {is_busy}")
        return jsonify({"response": "busy" if is_busy else "idle"}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": error}), 400


@nfc_pn532_routes.route("/write/", methods=["POST"])
def write_to_card():
    global nfc

    try:
        write_data = request.get_json()
        if not write_data or "data" not in write_data:
            raise ValueError("Missing 'data' field in request body")

        data = nfc.write_mifare_classic(data=write_data["data"], block=4)

        if data.get("error"):
            raise Exception(data.get("error", "unknown write error"))

        insert_msg("Write using PN532")
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": error}), 400


@nfc_pn532_routes.route("/reads/", methods=["GET"])
def read_from_card():
    global nfc

    try:
        data = nfc.read()

        if data.get("error"):
            raise Exception(data.get("error", "unknown write error"))

        insert_msg("Read from PN532")
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": error}), 400


@nfc_pn532_routes.route("/pause/", methods=["GET"])
def cancel():
    global nfc
    try:
        data = nfc.cancel()

        if data.get("error"):
            raise Exception(data.get("error", "unknown error when canceling"))

        insert_msg(f"canceling operation")
        return jsonify({"response": data["result"]}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": error}), 400
