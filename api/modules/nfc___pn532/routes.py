""""""

from flask import Blueprint, request, jsonify
from modules.log.logger import logger
from datetime import datetime
from inspect import currentframe
from .nfc_pn532 import NFC_PN532

nfc_pn532_routes = Blueprint("nfc_pn532_routes", __name__, url_prefix="/api/pn532")

nfc = NFC_PN532(timeout=4.0)
is_busy = False


def insert_msg(msg, sts):
    logger.add_entry(
        {
            "status": sts,
            "performed_at": datetime.isoformat(datetime.now()),
            "action": msg,
        }
    )


@nfc_pn532_routes.route("/status", methods=["GET"])
def get_hat_status():
    global is_busy
    return jsonify({"status": "busy" if is_busy else "idle"}), 200


@nfc_pn532_routes.route("/write", methods=["POST"])
def write_to_card():
    try:
        global is_busy, nfc

        if is_busy:
            raise Exception("reader currently busy")

        write_data = request.get_json()
        if not write_data or "data" not in write_data:
            raise ValueError("Missing 'data' field in request body")

        is_busy = True
        data = nfc.write_mifare_classic(data=write_data["data"], block=4)

        if not data.get("result"):
            raise Exception(data.get("error", "Unknown write error"))

        insert_msg("Write using PN532", currentframe().f_code.co_name)
        response = {"response": data["result"]}
        return jsonify(response), 200
    except Exception as e:
        error = str(e)
        insert_msg(f"Error occured: {error}", currentframe().f_code.co_name)
        response = {"error": f"error occured: {error}"}
        return jsonify(response), 400
    finally:
        is_busy = False


@nfc_pn532_routes.route("/read", methods=["GET"])
def read_from_card():
    try:
        global is_busy, nfc

        if is_busy:
            raise Exception("reader currently busy")

        is_busy = True
        data = nfc.read()

        if not data.get("result"):
            raise Exception(data.get("error", "Unknown write error"))

        insert_msg("Read from PN532", currentframe().f_code.co_name)
        response = {"response": data["result"]}
        return jsonify(response), 200
    except Exception as e:
        error = str(e)
        insert_msg(f"Error occured: {error}", currentframe().f_code.co_name)
        response = {"error": f"error occured: {error}"}
        return jsonify(response), 400
    finally:
        is_busy = False


@nfc_pn532_routes.route("/cancel", methods=["GET"])
def cancel():
    try:
        global is_busy, nfc

        data = nfc.cancel()
        is_busy = False

        if not data.get("result"):
            raise Exception(data.get("error", "Unknown write error"))

        response = {"response": "canceled"}
        return jsonify(response), 200
    except Exception as e:
        error = str(e)
        insert_msg(f"Error occured: {error}", currentframe().f_code.co_name)
        response = {"error": f"error occured: {error}"}
        return jsonify(response), 400
    finally:
        is_busy = False
