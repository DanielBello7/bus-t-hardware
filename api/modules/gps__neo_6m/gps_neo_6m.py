""""""

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
            self.last_data = {}
            self.thread = None
            self.stop_event = threading.Event()
            self.serial_port = serial.Serial(port, baudrate=baudrate, timeout=timeout)
        except Exception as e:
            self.stop_event = None
            self.serial_port = None
            print(f"failed to initialize: {str(e)}")

    def get_current_location(self):
        try:
            if not self.serial_port:
                raise Exception("serial port not initialized")

            line = self.serial_port.readline().decode("ascii", errors="replace").strip()
            if line.startswith("$GPGGA") or line.startswith("$GPRMC"):
                msg = pynmea2.parse(line)
                if hasattr(msg, "latitude") and hasattr(msg, "longitude"):
                    self.last_data = {
                        "timestamp": datetime.utcnow().isoformat() + "Z",
                        "latitude": msg.latitude,
                        "longitude": msg.longitude,
                        "altitude": getattr(msg, "altitude", None),
                        "num_sats": getattr(msg, "num_sats", None),
                        "raw": line,
                    }
                    return {"result": self.last_data}
            raise Exception("invalid parsing")
        except Exception as e:
            error = str(e)
            pprint({"error": error})
            return {"error": f"error occured: {error}"}

    def cancel_stream(self):
        """
        cancel the currently ongoing streaming function that's running on a separate thread
        """

        try:
            if not self.serial_port:
                raise Exception("serial port not initialized")

            if not self.thread or not self.thread.is_alive():
                raise Exception("currently not streaming")

            self.stop_event.set()
            self.thread.join()
            return {"result": "streaming stopped"}
        except Exception as e:
            error = str(e)
            pprint({"error": error})
            return {"error": f"error occured: {error}"}

    def get_last_location(self):
        if self.last_data:
            return {"result": self.last_data}
        else:
            return {"error": "no data available yet"}

    def stream_location(self):
        try:
            self.stop_event.clear()

            def stream_loop():
                while not self.stop_event.is_set():
                    try:
                        line = (
                            self.serial_port.readline()
                            .decode("ascii", errors="replace")
                            .strip()
                        )
                        if line.startswith("$GPGGA") or line.startswith("$GPRMC"):
                            try:
                                msg = pynmea2.parse(line)
                                if hasattr(msg, "latitude") and hasattr(
                                    msg, "longitude"
                                ):
                                    self.last_data = {
                                        "timestamp": datetime.utcnow().isoformat()
                                        + "Z",
                                        "latitude": msg.latitude,
                                        "longitude": msg.longitude,
                                        "altitude": getattr(msg, "altitude", None),
                                        "num_sats": getattr(msg, "num_sats", None),
                                        "raw": line,
                                    }
                            except pynmea2.ParseError:
                                continue
                    except Exception as e:
                        pprint({"error": f"streaming error: {str(e)}"})

            self.thread = threading.Thread(target=stream_loop)
            self.thread.start()

            return {"result": "streaming started"}
        except Exception as e:
            error = str(e)
            pprint({"error": error})
            return {"error": f"error occured: {error}"}

    def get_streaming_status(self):
        try:
            if not self.serial_port:
                raise Exception("serial port not initialized")

            return {"result": "idle" if self.thread.is_alive() else "active"}
        except Exception as e:
            error = str(e)
            pprint({"error": error})
            return {"error": f"error occured: {error}"}


if __name__ == "__main__":
    gps = GPS_NEO_6M()
    current = gps.get_current_location()
    pprint(f"current location: {current}")
