""""""

import board  # type: ignore
import busio  # type: ignore
import threading
from adafruit_ads1x15.ads1115 import ADS1115  # type: ignore
from adafruit_ads1x15.analog_in import AnalogIn  # type: ignore
from time import sleep
from pprint import pprint
from datetime import datetime


"""
this module helps read the voltage level of the battery or any device connected to it,
its being used to read the voltage level of the battery in this case and communicates on
the I2C bus
"""


class ADC_ADS1115:
    def __init__(self):
        try:
            self.i2c = busio.I2C(scl=board.SCL, sda=board.SDA)
            self.ads = ADS1115(self.i2c)
            self.channel = AnalogIn(self.ads, ADS1115.P0)  # or P1, P2, P3

            self.R1 = 10000
            self.R2 = 10000
            self.thread = None
            self.ptg = {}
            self.running = False
        except Exception as e:
            error = str(e)
            self.channel = None
            pprint(f"error occured: {error}")

    def _voltage_to_percent(self, v):
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
                percent = self._voltage_to_percent(a_voltage)
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
            self.thread = threading.Thread(target=self._listen_loop)
            self.thread.start()
            return {"result": "listening started"}
        except Exception as e:
            self.running = True
            error = str(e)
            pprint(f"error occurred: {error}")
            return {"error": f"error occurred: {error}"}

    def stop_listen(self):
        try:
            if not self.channel:
                raise Exception("not connected")

            if not self.thread or not self.thread.is_alive():
                raise Exception("not running")

            self.running = False
            self.thread.join(timeout=2)
            return {"result": "listening stopped"}
        except Exception as e:
            error = str(e)
            pprint(f"error occurred: {error}")
            return {"error": f"error occurred: {error}"}

    def percentage(self):
        try:
            if not self.channel:
                raise Exception("not connected")
            return dict(self.ptg)
        except Exception as e:
            pprint(f"error occurred: {str(e)}")
            return {"error": f"error occurred: {str(e)}"}


if __name__ == "__main__":
    battery = ADC_ADS1115()
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

""""""
