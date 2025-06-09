# API ENDPOINTS

## MCP3008 (ANALOG TO DIGITAL CONVERTER FOR BATTERY LEVEL)
1. http://localhost:5500/api/mcp3008/level/ ------[GET] ----✅
2. http://localhost:5500/api/mcp3008/start/ ------[GET] ----✅
3. http://localhost:5500/api/mcp3008/pause/ ------[GET] ----✅

## MCP3008 (ANALOG TO DIGITAL CONVERTER FOR BATTERY LEVEL)
1. http://localhost:5500/api/ads1115/level/ ------[GET] ----✅
2. http://localhost:5500/api/ads1115/start/ ------[GET] ----✅
3. http://localhost:5500/api/ads1115/pause/ ------[GET] ----✅

##  RFID RFC522
1. http://localhost:5500/api/rfc522/reads/ -------[GET] ----✅
2. http://localhost:5500/api/rfc522/write/ -------[POST] ---✅
3. http://localhost:5500/api/rfc522/pause/ -------[GET]  ---✅
4. http://localhost:5500/api/rfc522/stats/ -------[GET]  ---✅

## NFC PN532
1. http://localhost:5500/api/pn532/reads/ --------[GET]  ---✅
2. http://localhost:5500/api/pn532/write/ --------[POST] ---✅
3. http://localhost:5500/api/pn532/pause/ --------[GET]  ---✅
4. http://localhost:5500/api/pn532/stats/ --------[GET]  ---✅

## GPS
1. http://localhost:5500/api/gps/location/ -------[GET] ----✅
2. http://localhost:5500/api/gps/stream/ ---------[SOCKET] -✅

## LED
1. http://localhost:5500/api/led/on/ -------------[GET] ----✅
2. http://localhost:5500/api/led/off/ ------------[GET] ----✅
3. http://localhost:5500/api/led/blink/ ----------[GET] ----✅
4. http://localhost:5500/api/led/status/ ---------[GET] ----✅

## LOGS
1. http://localhost:5500/api/logs/ ---------------[GET] ----✅

## APP
1. http://localhost:5500/ping/ -------------------[GET] ----✅

## GSM
1. http://localhost:5500/api/gsm/config/ ---------[PATCH] --🚫
2. http://localhost:5500/api/gsm/connect/ --------[GET] ----🚫
3. http://localhost:5500/api/gsm/disconnect/ -----[GET] ----🚫