""""""

import RPi.GPIO  # type: ignore
import serial  # type: ignore
import pynmea2  # type: ignore
import threading
from pprint import pprint
from datetime import datetime

"""
Module that helps in handling the operations for a GPS module on 
the UART port.
"""


class GPS_NEO_6M:
    def __init__(self, port="/dev/serial0", baudrate=9600, timeout=1.0):
        try:
            self.serial_port = serial.Serial(port, baudrate=baudrate, timeout=timeout)
            self.last_data = {}
        except Exception as e:
            self.serial_port = None
            print(f"failed to initialize")

    def get_current_location(self):
        try:
            if not self.serial_port:
                raise Exception("serial port not initialized")

        except Exception as e:
            error = str(e)
            message = {"error": f"error occured: {error}"}
            pprint(message)
            return message

    def get_last_location(self):
        if self.last_data:
            return {"result": self.last_data}
        else:
            return {"error": "no data available yet"}

    def stream_location(self):
        try:
            return
        except Exception as e:
            error = str(e)
            message = {"error": f"error occured: {error}"}
            pprint(message)
            return message


if __name__ == "__main__":
    gps = GPS_NEO_6M()
