""""""

from mfrc522 import SimpleMFRC522  # type: ignore
from RPi.GPIO import cleanup  # type: ignore
from pprint import pprint
from multiprocessing import Process, Manager
import atexit
import time

"""
Module that helps in handling the operations for an NFC scanner running on
the I2C port, you can perform multiple operations on this, including
reading and writing onto nfc tags
"""

atexit.register(cleanup)


class NFC_MFRC522:
    def __init__(self, timeout):
        try:
            self.timeout = timeout
            self.is_busy = False
            # self._probe_reader()
        except Exception as e:
            error = str(e)
            pprint(f"Error occured: {error}")

    def _probe_reader(self):
        def check(result):
            try:
                reader = SimpleMFRC522()
                result["ready"] = True
            except Exception as e:
                result["error"] = str(e)
            finally:
                cleanup()

        from multiprocessing import Manager, Process

        with Manager() as manager:
            result = manager.dict()
            p = Process(target=check, args=(result,))
            p.start()
            p.join(2.0)

            if p.is_alive():
                p.terminate()
                p.join()
                raise Exception("Timeout probing NFC reader")

            if "error" in result:
                raise Exception(result["error"])

    def _safe_write(self, result, text):
        try:
            reader = SimpleMFRC522()
            reader.write(text)
            result["result"] = text
        except Exception as e:
            result["error"] = str(e)
        finally:
            cleanup()

    def _safe_reads(self, result):
        try:
            reader = SimpleMFRC522()
            id, data = reader.read()
            result["result"] = {"id": id, "data": data}
        except Exception as e:
            result["error"] = str(e)
        finally:
            cleanup()

    def reads(self):
        try:
            # if not self.reader:
            #     raise Exception("reader not initialized")

            self.is_busy = True

            with Manager() as manager:
                result = manager.dict()
                p = Process(target=self._safe_reads, args=(result,))
                p.start()
                p.join(self.timeout)

                if p.is_alive():
                    p.terminate()
                    result["error"] = "no card detected"

                if "error" in result:
                    raise Exception(result["error"])
                return dict(result)
        except Exception as e:
            error = str(e)
            pprint(f"Error occured: {error}")
            return {"error": f"error occured: {error}"}
        finally:
            self.is_busy = False

    def pause(self):
        """
        Only useful if the read is running in another thread.
        Just calls GPIO cleanup, but cannot interrupt `reader.read()` directly.
        """
        try:
            # if not self.reader:
            #     raise Exception("reader not initialized")

            cleanup()
            return {"result": "idle" if self.is_busy else "canceled"}
        except Exception as e:
            error = str(e)
            pprint(f"Error occured: {error}")
            return {"error": f"error occured: {error}"}

    def write(self, text="Hello NFC!"):
        try:
            # if not self.reader:
            #     raise Exception("reader not initialized")

            self.is_busy = True

            with Manager() as manager:
                result = manager.dict()
                p = Process(target=self._safe_write, args=(result, text))
                p.start()
                p.join(self.timeout)

                if p.is_alive():
                    p.terminate()
                    result["error"] = "Timeout — no card detected"

                if "error" in result:
                    raise Exception(result["error"])

                return dict(result)
        except Exception as e:
            self.is_busy = False
            error = str(e)
            pprint(f"Error occured: {error}")
            return {"error": f"error occured: {error}"}
        finally:
            self.is_busy = False


if __name__ == "__main__":
    nfc = NFC_MFRC522(timeout=4.0)
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
