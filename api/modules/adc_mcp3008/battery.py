""""""

import RPi.GPIO  # type: ignore

"""
Module that helps in reading the voltage level from the analog to digital 
converter which inturn gives the level of the battery connected to the 
system, it runs on the GPIO pin
"""


class Battery:
    def __init__(self, pin):
        self.pin = pin
        return


if __name__ == "__main__":
    battery = Battery()
