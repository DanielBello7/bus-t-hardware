# Makefile

start:
	gunicorn app:app -w 1 --threads 4 --bind 0.0.0.0:5500 --daemon --pid gunicorn.pid

dev:
	gunicorn app:app -w 1 --threads 4 --bind 0.0.0.0:5500