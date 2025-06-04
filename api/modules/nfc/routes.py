""""""

from flask import Blueprint, request
from api.modules.log.logger import logger
from datetime import datetime
from inspect import currentframe
from nfc import NFC
from multiprocessing import Process, Queue

nfc_routes = Blueprint("nfc_routes", __name__, url_prefix="/api/nfc")

nfc = NFC()
queue = Queue()
nfc_process = None
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
@nfc_routes.route("/read", methods=["GET"])
def read_from_nfc_card():
    if is_busy:
        return {"response": "reader currently busy"}
    try:
        insert_msg(currentframe().f_code.co_name, "Read From card")

        # start read process on another thread
        nfc_process = Process(target=nfc.read_from_card, args=(queue,))
        nfc_process.start()
        is_busy = True

        result = None

        # wait for 10s
        nfc_process.join(timeout=10)

        if nfc_process.is_alive():
            nfc_process.terminate()
            nfc_process.join()
        else:
            if not queue.empty():
                result = queue.get()

        is_busy = False
        return {"response": result}
    except Exception as e:
        insert_msg(f"Error occured when reading from nfc: {str(e)}")
        return {"error": f"Error occured: {str(e)}"}


# read data from nfc
@nfc_routes.route("/cancel", methods=["GET"])
def read_from_nfc_card():
    if not nfc_process and not is_busy:
        return {"response": "nothing active"}
    try:
        if nfc_process.is_alive():
            nfc_process.terminate()
            nfc_process.join()
        is_busy = False
        insert_msg(currentframe().f_code.co_name, "Success canceling operation")
        return {"response": "operation cancelled"}
    except Exception as e:
        insert_msg(f"Error occured when canceling operation: {str(e)}")
        return {"error": f"Error occured: {str(e)}"}
