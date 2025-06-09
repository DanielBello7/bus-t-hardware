""""""

from flask import Blueprint, request, jsonify
from modules.log.logger import logger
from datetime import datetime
from inspect import currentframe
from .nfc_mfrc522 import NFC_MFRC522

nfc_mfrc522_routes = Blueprint(
    "nfc_mfrc522_routes", __name__, url_prefix="/api/mfrc522"
)

nfc = NFC_MFRC522(timeout=4.0)
is_busy = False


# helper function to add message into the logger
def insert_msg(msg, sts):
    logger.add_entry(
        {
            "status": sts,
            "performed_at": datetime.isoformat(datetime.now()),
            "action": msg,
        }
    )


# read data from nfc
@nfc_mfrc522_routes.route("/read", methods=["GET"])
def read_from_nfc_card():
    global is_busy, nfc

    try:
        if is_busy:
            raise Exception("reader busy")

        is_busy = True
        data = nfc.read_from_card()
        is_busy = False

        if not data.get("result"):
            raise Exception(data.get("error", "unknown read error"))

        insert_msg("Read Using MFRC522", currentframe().f_code.co_name)
        return jsonify({"response": data}), 200
    except Exception as e:
        error = str(e)
        msg = f"Error occured: {error}"
        insert_msg(msg, currentframe().f_code.co_name)
        response = {"error": msg}
        return jsonify(response), 400
    finally:
        is_busy = False


@nfc_mfrc522_routes.route("/write", methods=["POST"])
def write_to_card():
    global is_busy, nfc

    try:
        if is_busy:
            raise Exception("reader busy")

        write_data = request.get_json()

        if not write_data or "data" not in write_data:
            raise ValueError("Missing 'data' field in request body")

        is_busy = True
        data = nfc.write_card(text=write_data["data"])
        is_busy = False

        if not data.get("result"):
            raise Exception(data.get("error", "unknown write error"))

        insert_msg("Write using MFRC522", currentframe().f_code.co_name)
        return jsonify({"response": data}), 200
    except Exception as e:
        error = str(e)
        msg = f"Error occured: {error}"
        insert_msg(msg, currentframe().f_code.co_name)
        response = {"error": msg}
        return jsonify(response), 400
    finally:
        is_busy = False


# cancel nfc operations
@nfc_mfrc522_routes.route("/cancel", methods=["GET"])
def cancel_operation():
    global is_busy, nfc

    try:
        data = nfc.cancel()
        is_busy = False
        if not data.get("result"):
            raise Exception(data.get("error", "unknown cancel error"))

        return jsonify({"response": "canceled"}), 200
    except Exception as e:
        error = str(e)
        msg = f"Error occured: {error}"
        insert_msg(msg, currentframe().f_code.co_name)
        response = {"error": msg}
        return jsonify(response), 400
    finally:
        is_busy = False


@nfc_mfrc522_routes.route("/status", methods=["GET"])
def status():
    global is_busy
    return jsonify({"response": "busy" if is_busy else "idle"}), 200
