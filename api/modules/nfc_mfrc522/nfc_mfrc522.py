""""""

from mfrc522 import SimpleMFRC522  # type: ignore
from pprint import pprint
import atexit
import RPi.GPIO as GPIO  # type: ignore
import time

"""
Module that helps in handling the operations for an NFC scanner running on
the I2C port, you can perform multiple operations on this, including
reading and writing onto nfc tags
"""

GPIO.setwarnings(False)
atexit.register(GPIO.cleanup)


class NFC_MFRC522:
    def __init__(self, timeout):
        try:
            self.reader = SimpleMFRC522()
            self.timeout = timeout
            self.is_busy = False
        except Exception as e:
            error = str(e)
            pprint(f"Error occurred: {error}")

    def reads(self):
        try:
            if not self.reader:
                raise Exception("reader not initialized")

            self.is_busy = True

            start_time = time.time()

            while time.time() - start_time < self.timeout:
                id, text = self.reader.read_no_block()
                if id:
                    return {"result": text.strip()}
                time.sleep(0.1)

            raise Exception("no card detected...")
        except Exception as e:
            error = str(e)
            pprint(f"Error occurred: {error}")
            return {"error": f"error occurred: {error}"}
        finally:
            self.is_busy = False

    def cleanup(self):
        """
        Only useful if the read is running in another thread.
        Just calls GPIO cleanup, but cannot interrupt `reader.read()` directly.
        """
        try:
            if not self.reader:
                raise Exception("reader not initialized")

            GPIO.cleanup()
            return {"result": "idle" if self.is_busy else "canceled"}
        except Exception as e:
            error = str(e)
            pprint(f"Error occurred: {error}")
            return {"error": f"error occurred: {error}"}

    def write(self, text="Hello NFC!"):
        try:
            if not self.reader:
                raise Exception("reader not initialized")

            self.is_busy = True

            start_time = time.time()

            while time.time() - start_time < self.timeout:
                id, _ = self.reader.read_no_block()
                if id:
                    id_w, txt_w = self.reader.write(text.strip())
                    pprint(id_w)
                    pprint(txt_w)
                    if not id_w:
                        raise Exception("write failed — no card id returned")
                    return {"result": txt_w.strip}
                time.sleep(0.1)

            raise Exception("no card detected")
        except Exception as e:
            error = str(e)
            pprint(f"Error occurred: {error}")
            return {"error": f"error occurred: {error}"}
        finally:
            self.is_busy = False


if __name__ == "__main__":
    nfc = NFC_MFRC522(timeout=5.0)
    try:
        while True:
            pprint("waiting for card...")
            result = nfc.reads()
            pprint(result)
    except KeyboardInterrupt:
        pprint("canceled by user")
    except Exception as e:
        pprint(f"error: {str(e)}")
