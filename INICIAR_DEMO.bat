@echo off
title MotoTX Launcher
color 0f
echo ==================================================
echo   INICIANDO SCOOTER DE BAMAKO (MotoTX) 🛵🇲🇱
echo ==================================================
echo.

echo [0/3] Limpiando procesos antiguos...

taskkill /F /IM php.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1

cd backend

if exist public\hot del public\hot
if exist public\build rmdir /s /q public\build

echo [0/3] Compilando la App (Esto tarda unos segundos)...
call npm run build

echo [1/3] Arrancando Servidor Laravel...
start "MotoTX Backend" php artisan serve --host=0.0.0.0

echo [2/3] Arrancando WebSockets (Reverb)...
start "MotoTX Reverb" php artisan reverb:start

echo [3/3] Creando Tunel de Acceso Remoto...
echo.
echo --------------------------------------------------
echo   TU PASSWORD DEL TUNEL ES:
curl -4 -s icanhazip.com
echo --------------------------------------------------
echo.
echo Intentando reservar URL: https://mototx-bko-live.loca.lt
echo.
echo SI VEZ LA URL ABAJO, USA ESA. SI NO, USA LA QUE SALGA.
echo.
call npx -y localtunnel --port 8000 --subdomain mototx-bko-live --local-host 127.0.0.1

pause
