""""""

from mfrc522 import SimpleMFRC522  # type: ignore
from pprint import pprint
from multiprocessing import Process, Pipe
import atexit
import RPi.GPIO as GPIO  # type: ignore

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

    def _safe_write(self, conn, text):
        try:
            reader = SimpleMFRC522()
            reader.write(text)
            conn.send(text)
        except Exception as e:
            conn.send(f"error writing card: {str(e)}")
        finally:
            conn.close()

    def _safe_reads(self, conn):
        try:
            reader = SimpleMFRC522()
            id, text = reader.read()
            conn.send(text)
        except Exception as e:
            conn.send(f"error reading card: {str(e)}")
        finally:
            conn.close()

    def reads(self):
        parent_conn, child_conn = Pipe()
        p = None
        try:
            if not self.reader:
                raise Exception("reader not initialized")

            self.is_busy = True

            p = Process(target=self._safe_reads, args=(child_conn,))
            p.start()

            if parent_conn.poll(self.timeout):  # Wait up to 5 seconds
                result = parent_conn.recv()
                return {"result": result}
            else:
                raise Exception("timeout: no card detected")
        except Exception as e:
            if p and p.is_alive():
                p.terminate()
            error = str(e)
            pprint(f"Error occurred: {error}")
            return {"error": f"error occurred: {error}"}
        finally:
            self.is_busy = False

    def pause(self):
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
        parent_conn, child_conn = Pipe()
        p = None
        try:
            if not self.reader:
                raise Exception("reader not initialized")

            self.is_busy = True

            p = Process(
                target=self._safe_write,
                args=(
                    child_conn,
                    text,
                ),
            )
            p.start()

            if parent_conn.poll(self.timeout):  # Wait up to 5 seconds
                result = parent_conn.recv()
                return {"result": result}
            else:
                raise Exception("timeout: no card detected")

        except Exception as e:
            if p and p.is_alive():
                p.terminate()
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
            pprint("read successful")
            pprint(result)
    except KeyboardInterrupt:
        pprint("canceled by user")
    except Exception as e:
        pprint(f"error: {str(e)}")
