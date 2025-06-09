""""""

import busio  # type: ignore
import digitalio  # type: ignore
import board  # type: ignore
from adafruit_mcp3xxx.mcp3008 import MCP3008  # type: ignore
from adafruit_mcp3xxx.analog_in import AnalogIn  # type: ignore
from time import sleep
from pprint import pprint
from datetime import datetime
from multiprocessing import Process, Value, Manager

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
            self.process = None
            self.running = Value("b", False)
            self.manager = Manager()
            self.ptg = self.manager.dict()
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

    def _listen_loop(self, running_flag, ptg_dict):
        while running_flag.value:
            try:
                m_voltage = self.channel.voltage
                a_voltage = m_voltage * (self.R1 + self.R2) / self.R2
                percent = self.voltage_to_percent(a_voltage)
                data = {
                    "voltage": round(a_voltage, 2),
                    "percentage": percent,
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                }
                ptg_dict.update(data)
                sleep(1)
            except Exception as e:
                pprint({"loop error": str(e)})

    def listen(self):
        try:
            if not self.channel:
                raise Exception("not connected")

            if self.process and self.process.is_alive():
                return {"result": "already running"}

            self.running.value = True
            self.process = Process(
                target=self._listen_loop, args=(self.running, self.ptg)
            )
            self.process.start()

            return {"result": "listening started"}
        except Exception as e:
            pprint(f"error occurred: {str(e)}")
            return {"error": f"error occurred: {str(e)}"}

    def stop_listen(self):
        try:
            if not self.channel:
                raise Exception("not connected")

            if not self.process or not self.process.is_alive():
                return {"result": "not running"}

            self.running.value = False
            self.process.join(timeout=2)
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
