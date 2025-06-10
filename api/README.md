# API ENDPOINTS

## ADS1115 (ANALOG TO DIGITAL CONVERTER FOR BATTERY LEVEL)
1. http://localhost:5500/api/ads1115/level/ ------[GET] ----✅
2. http://localhost:5500/api/ads1115/start/ ------[GET] ----✅
3. http://localhost:5500/api/ads1115/pause/ ------[GET] ----✅

## MCP3008 (ANALOG TO DIGITAL CONVERTER FOR BATTERY LEVEL)
1. http://localhost:5500/api/mcp3008/level/ ------[GET] ----✅
2. http://localhost:5500/api/mcp3008/start/ ------[GET] ----✅
3. http://localhost:5500/api/mcp3008/pause/ ------[GET] ----✅

## GPS
1. http://localhost:5500/api/gps/location/ -------[GET] ----✅
2. http://localhost:5500/api/gps/last_saved/ -----[GET] ----✅
3. http://localhost:5500/api/gps/cancel_stream/ --[GET] ----✅
4. http://localhost:5500/api/gps/stream/ ---------[GET] ----✅
5. http://localhost:5500/api/gps/status/ ---------[GET] ----✅

## GSM
1. http://localhost:5500/api/gsm/config/ ---------[PATCH] --🚫
2. http://localhost:5500/api/gsm/connect/ --------[GET] ----🚫
3. http://localhost:5500/api/gsm/disconnect/ -----[GET] ----🚫

## LED
1. http://localhost:5500/api/led/on/ -------------[GET] ----✅
2. http://localhost:5500/api/led/off/ ------------[GET] ----✅
3. http://localhost:5500/api/led/blink/ ----------[GET] ----✅
4. http://localhost:5500/api/led/status/ ---------[GET] ----✅

## LOGS
1. http://localhost:5500/api/logs/ ---------------[GET] ----✅

## NFC PN532
1. http://localhost:5500/api/pn532/reads/ --------[GET]  ---✅
2. http://localhost:5500/api/pn532/write/ --------[POST] ---✅
3. http://localhost:5500/api/pn532/pause/ --------[GET]  ---✅
4. http://localhost:5500/api/pn532/stats/ --------[GET]  ---✅

##  RFID RFC522
1. http://localhost:5500/api/rfc522/reads/ -------[GET] ----✅
2. http://localhost:5500/api/rfc522/write/ -------[POST] ---✅
3. http://localhost:5500/api/rfc522/pause/ -------[GET]  ---✅
4. http://localhost:5500/api/rfc522/stats/ -------[GET]  ---✅

## APP
1. http://localhost:5500/ping/ -------------------[GET] ----✅
