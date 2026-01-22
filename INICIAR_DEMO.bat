@echo off
title MotoTX Launcher
color 0f
echo ==================================================
echo   INICIANDO MOTO-TAXI BAMAKO (MotoTX) 🛵🇲🇱
echo ==================================================
echo.
echo [!] RECUERDA: El acceso principal es siempre:
echo     https://mtxnov-production.up.railway.app
echo.
echo [!] SI HAY ERRORES, USA LA RUTA DE RESCATE:
echo     https://mtxnov-production.up.railway.app/api/init-db
echo.
echo --------------------------------------------------
echo [1/3] Limpiando procesos antiguos...

taskkill /F /IM php.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1

cd backend

if exist public\hot del public\hot
if exist public\build rmdir /s /q public\build

echo [2/3] Compilando la App (Esto tarda unos segundos)...
call npm run build

echo [3/3] Arrancando Servidor Laravel Local...
start "MotoTX Backend" php artisan serve --host=0.0.0.0

echo [3/3] Arrancando WebSockets (Reverb)...
start "MotoTX Reverb" php artisan reverb:start

echo.
echo --------------------------------------------------
echo   ACCESO REMOTO (BACKUP)
echo --------------------------------------------------
echo TU PASSWORD DEL TUNEL ES:
curl -4 -s icanhazip.com
echo --------------------------------------------------
echo.
echo Intentando reservar URL: https://mototx-bko-live.loca.lt
echo.
call npx -y localtunnel --port 8000 --subdomain mototx-bko-live --local-host 127.0.0.1

pause
