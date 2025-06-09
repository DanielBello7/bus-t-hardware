""""""

from adafruit_pn532.i2c import PN532_I2C  # type: ignore
from RPi.GPIO import cleanup  # type: ignore
import board  # type: ignore
import busio  # type: ignore
from digitalio import DigitalInOut  # type: ignore
from pprint import pprint
import atexit


atexit.register(cleanup)


class NFC_PN532:
    def __init__(self, timeout):
        try:
            self.i2c = busio.I2C(board.SCL, board.SDA)
            self.reset_pin = DigitalInOut(board.D6)
            self.req_pin = DigitalInOut(board.D12)
            self.timeout = timeout
            self.pn532 = PN532_I2C(
                self.i2c, debug=False, reset=self.reset_pin, req=self.req_pin
            )
            self.pn532.SAM_configuration()
        except Exception as e:
            self.i2c = None
            self.reset_pin = None
            self.req_pin = None
            self.pn532 = None
            pprint(f"Error occured: {str(e)}")

    def read_uuid(self, as_string=False):
        try:
            if not self.pn532:
                raise Exception("reader not initialized")

            uid = self.pn532.read_passive_target(timeout=self.timeout)
            if uid == None:
                return None

            if as_string:
                uid_string = "".join(f"{i:02X}" for i in uid)
                return {"result": uid_string}
            else:
                return uid
        except Exception as e:
            error = str(e)
            pprint(f"Error occured: {error}")
            return None

    def authenticate(self, uid, block_number=4):
        try:
            if not self.pn532:
                raise Exception("reader not initialized")

            key = b"\xff\xff\xff\xff\xff\xff"
            if self.pn532.mifare_classic_authenticate_block(
                uid, block_number, self.pn532.MIFARE_CMD_AUTH_A, key
            ):
                return True
            else:
                return False
        except Exception as e:
            error = str(e)
            pprint(f"Error occured: {error}")
            return False

    def read(self, block=4):
        try:
            if not self.pn532:
                raise Exception("reader not initialized")

            uid = self.read_uuid(as_string=False)
            if uid is None:
                return {"error": "no card detected"}

            auth = self.authenticate(uid=uid, block_number=block)
            if auth == False:
                return {"error": "unable to read from card, authentication failed"}

            data = self.pn532.mifare_classic_read_block(block)
            decoded = data.decode().rstrip("\x00")
            return {"result": decoded}
        except Exception as e:
            error = str(e)
            pprint(f"Error occured: {error}")
            return {"error": error}

    def write_mifare_classic(self, data="Hello NFC Card!", block=4):
        try:
            if not self.pn532:
                raise Exception("reader not initialized")

            uid = self.read_uuid(as_string=False)
            if uid is None:
                return {"error": "no card detected"}

            auth = self.authenticate(uid=uid, block_number=block)
            if auth == False:
                return {"error": "authentication failed"}

            payload = bytearray(data.encode("utf-8")).ljust(16, b"\x00")
            self.pn532.mifare_classic_write_block(block, payload)

            return self.read(block=block)
        except Exception as e:
            error = str(e)
            pprint(f"Error occured: {error}")
            return {"error": error}

    def cancel(self):
        """
        Only useful if the read is running in another thread.
        Just calls GPIO cleanup, but cannot interrupt `reader.read()` directly.
        """
        try:
            if not self.pn532:
                raise Exception("reader not initialized")

            cleanup()
            return {"result": "canceled"}
        except Exception as e:
            error = str(e)
            pprint(f"Error occured: {error}")
            return {"error": f"error occured: {error}"}


if __name__ == "__main__":
    nfc = NFC_PN532(timeout=0.5)
    pprint("Present card for writing...")
    result = nfc.read()
    pprint(result)
