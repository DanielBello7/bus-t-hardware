""""""

from mfrc522 import SimpleMFRC522  # type: ignore
from RPi.GPIO import cleanup  # type: ignore
from pprint import pprint
import atexit
import threading

"""
Module that helps in handling the operations for an NFC scanner running on
the I2C port, you can perform multiple operations on this, including
reading and writing onto nfc tags 
"""

atexit.register(cleanup)


class NFC_MFRC522:
    def __init__(self, timeout):
        try:
            self.reader = SimpleMFRC522()
            self.timeout = timeout
            self.is_busy = False
        except Exception as e:
            error = str(e)
            pprint(f"Error occured: {error}")
            self.reader = None

    def reads(self):
        try:
            if not self.reader:
                raise Exception("reader not initialized")

            result = {}

            def read_op():
                try:
                    id, data = self.reader.read()
                    result["result"] = {"id": id, "data": data}
                except Exception as e_inner:
                    result["error"] = str(e_inner)

            self.is_busy = True
            thread = threading.Thread(target=read_op)
            thread.start()
            thread.join(timeout=self.timeout)

            if thread.is_alive():
                raise Exception("no card detected")

            if "error" in result:
                raise Exception(result["error"])

            self.is_busy = False
            return result
        except Exception as e:
            self.is_busy = False
            error = str(e)
            pprint(f"Error occured: {error}")
            return {"error": f"error occured: {error}"}

    def pause(self):
        """
        Only useful if the read is running in another thread.
        Just calls GPIO cleanup, but cannot interrupt `reader.read()` directly.
        """
        try:
            if not self.reader:
                raise Exception("reader not initialized")

            cleanup()
            return {"result": "canceled"}
        except Exception as e:
            error = str(e)
            pprint(f"Error occured: {error}")
            return {"error": f"error occured: {error}"}

    def write(self, text="Hello NFC!"):
        try:
            if not self.reader:
                raise Exception("reader not initialized")

            result = {}

            def write_op():
                try:
                    self.reader.write(text)
                except Exception as e_inner:
                    result["error"] = str(e_inner)

            self.is_busy = True
            thread = threading.Thread(target=write_op)
            thread.start()
            thread.join(timeout=self.timeout)

            if thread.is_alive():
                raise Exception("no card detected")

            if "error" in result:
                raise Exception(result["error"])

            self.is_busy = False
            return result
        except Exception as e:
            self.is_busy = False
            error = str(e)
            pprint(f"Error occured: {error}")
            return {"error": f"error occured: {error}"}


if __name__ == "__main__":
    nfc = NFC_MFRC522(timeout=4.0)
    pprint("waiting for card...")
    result = nfc.reads()
    pprint("read successful")
    pprint(result)
