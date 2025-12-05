FROM serversideup/php:8.4-fpm-nginx

USER root

RUN install-php-extensions intl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs

WORKDIR /var/www/html

# Copy composer files first to leverage Docker cache
COPY --chown=www-data:www-data ./composer.json .

# Install Composer dependencies (production-only)
RUN composer update
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy package.json and package-lock.json for npm
COPY --chown=www-data:www-data ./package.json .

# Install npm dependencies (production-only)
RUN npm i

# Copy the rest of the Laravel app
COPY --chown=www-data:www-data . .

# Build frontend assets (e.g., Vite, Mix, etc.)
RUN npm run build

# Set proper ownership and permissions
RUN chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

USER www-data
