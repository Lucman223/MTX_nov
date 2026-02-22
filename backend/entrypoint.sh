#!/bin/bash

# Asegurar que estamos en el directorio correcto
cd /app/backend || cd /app || exit 1

echo "--- INICIANDO CONFIGURACIÓN DE MOTO TX ---"

# 1. Crear la base de datos si no existe
mkdir -p database
touch database/database.sqlite
chmod 777 database/database.sqlite
chmod 777 database

# 2. Asegurar permisos de storage
mkdir -p storage/framework/{sessions,views,cache}
chmod -R 777 storage
chmod -R 777 bootstrap/cache

# 3. Inicializar base de datos
php artisan migrate --force --seed

# 4. Arrancar servidores simultáneamente
# Usamos php -S porque es más explícito con el directorio -t public
echo "--- LANZANDO SERVIDORES ---"
concurrently \
  "php -S 0.0.0.0:$PORT -t public" \
  "php artisan reverb:start --host=0.0.0.0 --port=8080"
