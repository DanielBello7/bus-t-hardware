#!/bin/bash

python3 -m venv venv

source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

pkill gunicorn

echo "Starting server..."
gunicorn app:app --bind 0.0.0.0:5500 --daemon --pid gunicorn.pid

echo "Server started at http://0.0.0.0:5500"
