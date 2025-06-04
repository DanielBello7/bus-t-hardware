# API ENDPOINTS

## BATTERY
1. http://localhost:5500/api/battery/level/ ------[GET] ----

##  NFC 
1. http://localhost:5500/api/nfc/read/ -----------[GET] ----
2. http://localhost:5500/api/nfc/write/ ----------[POST] ---
3. http://localhost:5500/api/nfc/cancel/ ---------[GET]  ---

## GPS
1. http://localhost:5500/api/gps/location/ -------[GET] ----
2. http://localhost:5500/api/gps/stream/ ---------[SOCKET] -

## LED
1. http://localhost:5500/api/led/on/ -------------[GET] ----✅
2. http://localhost:5500/api/led/off/ ------------[GET] ----✅
3. http://localhost:5500/api/led/blink/ ----------[GET] ----✅
4. http://localhost:5500/api/led/status/ ---------[GET] ----✅

## LOGS
1. http://localhost:5500/api/logs/ ---------------[GET] ----✅

## APP
1. http://localhost:5500/ping/ -------------------[GET] ----