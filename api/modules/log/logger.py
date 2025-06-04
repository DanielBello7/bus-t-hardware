""""""

from .log import Log
from dotenv import dotenv_values

config = dotenv_values(".env")
logger = Log(config["LOG"])
