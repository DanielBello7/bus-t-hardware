""""""

from pprint import pprint
import gpiozero
from time import sleep

"""
Module that helps in handling the operations for an LED light running on
the I2C port, you can perform multiple operations on this, including
toggling the lights on and off and pulsing the lights in a christmas 
fashion
"""


class LED:
    def __init__(self, pin):
        self.pin = pin
        self.is_on = False

        try:
            self.led = gpiozero.PWMLED(self.pin)
            # used the gpiozero PWMLED api because it can perform both turning on/off and pulse functions
            # self.led = gpiozero.LED(self.pin)
        except Exception as e:
            pprint(str(e))
            print("error connecting to the hardware")

    # turn the lights on
    def turn_on(self):
        self.led.on()
        self.is_on = True
        return {"status": self.is_on}

    # turn the lights off
    def turn_off(self):
        self.led.off()
        self.is_on = False
        return {"status": self.is_on}

    # pulse the lights in a regulated fashion
    def blink_lights(self, dur=3):
        self.led.blink()
        sleep(dur)
        self.pulse._stop_blink()
        self.is_on = True
        return {"status": self.is_on}


# enable testing for the module
if __name__ == "__main__":
    switch = LED(17)
    pprint(switch.turn_on())
