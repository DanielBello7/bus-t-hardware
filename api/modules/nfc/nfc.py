""""""

from mfrc522 import SimpleMFRC522  # type: ignore
from RPi.GPIO import cleanup  # type: ignore
from pprint import pprint
import atexit

"""
Module that helps in handling the operations for an NFC scanner running on
the I2C port, you can perform multiple operations on this, including
reading and writing onto nfc tags 
"""

atexit.register(cleanup)


class NFC:
    def __init__(self):
        try:
            self.reader = SimpleMFRC522()
        except Exception as e:
            pprint(f"Error occured: {str(e)}")
            self.reader = None

    def read_from_card(self, queue=None):
        if not self.reader:
            result = {"error": "Reader not initialized."}
            if queue:
                queue.put(result)
            else:
                return result

        try:
            id, response = self.reader.read()
            result = {"id": id, "response": response}
        except Exception as e:
            pprint(f"Error occured: {str(e)}")
            return
        finally:
            cleanup()
            if queue:
                queue.put(result)
            return result

    def cancel_read(self):
        """
        Only useful if the read is running in another thread.
        Just calls GPIO cleanup, but cannot interrupt `reader.read()` directly.
        """
        if not self.reader:
            raise Exception("reader not initialized")

        try:
            cleanup()
            pprint("canceled the read operation")
        except Exception as e:
            pprint(f"Error occured: {str(e)}")
            return None


if __name__ == "__main__":
    nfc = NFC()
    result = nfc.read_from_card()
    pprint(f"result: {result}")
