""""""

from flask import Blueprint, request, jsonify  # type: ignore
from modules.log.logger import logger
from datetime import datetime
from inspect import currentframe
from .nfc_mfrc522 import NFC_MFRC522

nfc_mfrc522_routes = Blueprint(
    "nfc_mfrc522_routes", __name__, url_prefix="/api/mfrc522"
)

nfc = NFC_MFRC522(timeout=4.0)


# helper function to add message into the logger
def insert_msg(msg):
    logger.add_entry(
        {
            "status": msg,
            "action": currentframe().f_back.f_code.co_name,
            "performed_at": datetime.utcnow().isoformat() + "Z",
        }
    )


# read data from nfc
@nfc_mfrc522_routes.route("/reads/", methods=["GET"])
def read_from_nfc_card():
    global nfc

    try:
        data = nfc.reads()

        if not data.get("result"):
            raise Exception(data.get("error", "unknown read error"))

        insert_msg("Read Using MFRC522")
        return jsonify({"response": data}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": error}), 400


# write to card through nfc
@nfc_mfrc522_routes.route("/write/", methods=["POST"])
def write_to_card():
    global nfc

    try:
        write_data = request.get_json()
        if not write_data or "data" not in write_data:
            raise ValueError("Missing 'data' field in request body")

        data = nfc.write(text=write_data["data"])
        if not data.get("result"):
            raise Exception(data.get("error", "unknown write error"))

        insert_msg("Write using MFRC522", currentframe().f_code.co_name)
        return jsonify({"response": data}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": error}), 400


# cancel nfc operations
@nfc_mfrc522_routes.route("/pause/", methods=["GET"])
def cancel_operation():
    global nfc

    try:
        data = nfc.pause()
        if not data.get("result"):
            raise Exception(data.get("error", "unknown cancel error"))

        return jsonify({"response": "canceled"}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": error}), 400


@nfc_mfrc522_routes.route("/stats/", methods=["GET"])
def status():
    global nfc

    try:
        is_busy = nfc.is_busy
        return jsonify({"response": "busy" if is_busy else "idle"}), 200
    except Exception as e:
        error = str(e)
        insert_msg(error)
        return jsonify({"error": error}), 400


""""""
