# Script para iniciar la Demo de MotoTX rápidamente
# Uso: Ejecuta este script 5 minutos antes de la presentación

Write-Host "🚀 Iniciando Entorno de Demo MotoTX..." -ForegroundColor Cyan

# 1. Iniciar servidores (Laravel + Vite) en segundo plano
Write-Host "📦 Iniciando servidores..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run start" -WindowStyle Minimized

# 2. Esperar a que los puertos estén listos
Write-Host "⏳ Esperando a que el sistema esté listo (10s)..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# 3. Abrir Navegador directamente en la plataforma (Modo App)
Write-Host "🌐 Abriendo MotoTX en el Dashboard..." -ForegroundColor Green
# Intentamos abrir Chrome en modo App para que parezca una aplicación nativa
Start-Process "chrome.exe" "--app=http://localhost:8000/login"

Write-Host "✅ Entorno listo. ¡Mucha suerte con los jueces! 🏎️💨" -ForegroundColor White
