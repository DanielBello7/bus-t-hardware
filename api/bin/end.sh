#!/bin/bash

if [ -f gunicorn.pid ]; then
  kill -TERM $(cat gunicorn.pid) && rm gunicorn.pid
  echo "Gunicorn stopped."
else
  echo "No PID file found. Is Gunicorn running?"
fi