@echo off
title MotoTX - Túnel de Rescate (Cloudflare)
color 0e

echo ==================================================
echo   LANZANDO TÚNEL DE RESCATE (CLOUDFLARE) 🚀
echo ==================================================
echo.

if not exist "backend\cloudflared.exe" (
    echo [ERROR] No se encuentra backend\cloudflared.exe
    echo Por favor, asegúrate de estar en la carpeta raíz del proyecto.
    pause
    exit /b
)

echo [1/2] Verificando que el servidor Laravel esté activo...
curl -s -I http://localhost:8000 | findstr "HTTP/1.1" > nul
if errorlevel 1 (
    echo [!] El servidor Laravel (puerto 8000) no parece estar respondiendo.
    echo [!] Recuerda ejecutar INICIAR_DEMO.bat primero.
    echo.
)

echo [2/2] Abriendo túnel seguro hacia localhost:8000...
echo.
echo --------------------------------------------------
echo BUSCA LA URL QUE ACABA EN ".trycloudflare.com"
echo --------------------------------------------------
echo.

backend\cloudflared.exe tunnel --url http://localhost:8000

pause
