""""""

import busio  # type: ignore
import digitalio  # type: ignore
import board  # type: ignore
from adafruit_mcp3xxx.mcp3008 import MCP3008  # type: ignore
from adafruit_mcp3xxx.analog_in import AnalogIn  # type: ignore
from time import sleep
from pprint import pprint
from datetime import datetime
import threading

"""
Module that helps in reading the voltage level from the analog to digital 
converter which in turn gives the level of the battery connected to the 
system. It runs on the GPIO pin.
"""


class ADC_MCP3008:
    def __init__(self):
        try:
            self.spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
            self.cs = digitalio.DigitalInOut(board.D8)
            self.mcp = MCP3008(self.spi, self.cs)
            self.channel = AnalogIn(self.mcp, MCP3008.P0)

            self.R1 = 10000
            self.R2 = 10000
            self.thread = None
            self.ptg = {}
            self.running = False
        except Exception as e:
            self.channel = None
            pprint(f"error occurred: {str(e)}")

    def voltage_to_percent(self, v):
        if v >= 4.2:
            return 100
        elif v <= 3.0:
            return 0
        else:
            return int(((v - 3.0) / (4.2 - 3.0)) * 100)

    def _listen_loop(self):
        while self.running:
            try:
                m_voltage = self.channel.voltage
                a_voltage = m_voltage * (self.R1 + self.R2) / self.R2
                percent = self.voltage_to_percent(a_voltage)
                data = {
                    "voltage": round(a_voltage, 2),
                    "percentage": percent,
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                }
                self.ptg = data
                sleep(1)
            except Exception as e:
                pprint({"loop error": str(e)})

    def listen(self):
        try:
            if not self.channel:
                raise Exception("not connected")

            if self.thread and self.thread.is_alive():
                return {"result": "already running"}

            self.running = True
            self.thread = threading.Thread(target=self._listen_loop, daemon=True)
            self.thread.start()

            return {"result": "listening started"}
        except Exception as e:
            self.running = True
            pprint(f"error occurred: {str(e)}")
            return {"error": f"error occurred: {str(e)}"}

    def stop_listen(self):
        try:
            if not self.channel:
                raise Exception("not connected")

            if not self.thread or not self.thread.is_alive():
                return {"result": "not running"}

            self.running = False
            self.thread.join(timeout=2)
            self.thread = None
            return {"result": "listening stopped"}
        except Exception as e:
            pprint(f"error occurred: {str(e)}")
            return {"error": f"error occurred: {str(e)}"}

    def percentage(self):
        try:
            if not self.channel:
                raise Exception("not connected")
            return dict(self.ptg)
        except Exception as e:
            pprint(f"error occurred: {str(e)}")
            return {"error": f"error occurred: {str(e)}"}


if __name__ == "__main__":
    battery = ADC_MCP3008()
    res = battery.listen()
    pprint(res)
    try:
        while True:
            lvl = battery.percentage()
            pprint(lvl)
            sleep(1)
    except KeyboardInterrupt:
        battery.stop_listen()
        print("Stopped by user.")
