# Usamos una imagen oficial de PHP con Apache
FROM php:8.2-apache

# 1. Instalar dependencias del sistema y extensiones de PHP
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    unzip \
    git \
    sqlite3 \
    libsqlite3-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_mysql pdo_sqlite bcmath pcntl

# 2. Instalar Node.js y NPM (necesarios para los assets y Reverb)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# 3. Habilitar mod_rewrite de Apache para Laravel
RUN a2enmod rewrite

# 4. Configurar el DocumentRoot de Apache a /var/www/html/public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 5. Copiar el código del proyecto
WORKDIR /var/www/html
COPY . .

# [ESTRUCTURA_INMORTAL] Forzar variables de entorno para evitar conflictos con .env
ENV DB_CONNECTION=sqlite
ENV DB_DATABASE=/var/www/html/database/database.sqlite
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV AUTH_GUARD=api
# APP_KEY y JWT_SECRET deben ser configuradas en el panel de Koyeb, pero ponemos valores por defecto para que no falle el arranque
ENV APP_KEY=base64:7D69JvVrMN1vpkBJEourXwNVxyLh9R1nHpdJi6LlVyc=
ENV JWT_SECRET=ovw9lBCDx2KYNPFH3w89BkdYNWDMUo7W0I8WnrXN9Ev1l8L7RB6SzAUaUjTt6sGX

# 6. Instalar dependencias de PHP y JS
ENV COMPOSER_ALLOW_SUPERUSER 1
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-interaction --optimize-autoloader
RUN npm install && npm run build

# 7. Permisos para Laravel
RUN chown -R www-data:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# 8. Script de arranque final
RUN echo '#!/bin/bash\n\
cd /var/www/html\n\
mkdir -p database\n\
touch database/database.sqlite\n\
chmod 777 database/database.sqlite\n\
chmod 777 database\n\
# Limpiar caches para forzar lectura de nuevas ENVs del contenedor\n\
php artisan config:clear\n\
php artisan cache:clear\n\
# Migrar y sembrar\n\
php artisan migrate --force --seed\n\
# Iniciar Reverb en segundo plano y Apache en primer plano\n\
php artisan reverb:start --host=0.0.0.0 --port=8080 &\n\
apache2-foreground' > /usr/local/bin/start-app.sh && chmod +x /usr/local/bin/start-app.sh

EXPOSE 80 8080

CMD ["start-app.sh"]
