# ============================================================================
# Stage 1: Composer Dependencies
# ============================================================================
# Install PHP dependencies using the same base image as final stage
# This ensures PHP version compatibility across all stages
FROM serversideup/php:8.4-fpm-nginx-alpine AS composer-dependencies

# Switch to root to install extensions
USER root

# Install required PHP extensions for Composer
RUN install-php-extensions intl

WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./

# Install production dependencies only
# --no-dev: Skip dev dependencies (testing, linting tools)
# --no-scripts: Skip post-install scripts (will run in final stage)
# --no-interaction: Non-interactive mode for CI/CD
# --prefer-dist: Download archives instead of cloning repos (faster)
# --optimize-autoloader: Generate optimized autoloader for production
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

# ============================================================================
# Stage 2: Frontend Build
# ============================================================================
# Build frontend assets (Vite) using Node.js
# The compiled assets will be copied to the final image
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install npm dependencies
RUN npm ci --production=false

# Copy source files needed for build
COPY resources/ ./resources/
COPY public/ ./public/
COPY vite.config.js ./

# Build frontend assets with Vite
# Output goes to public/build/
RUN npm run build

# ============================================================================
# Stage 3: Final Production Image
# ============================================================================
# This is the final, minimal runtime image
# It only contains what's needed to run the application
FROM serversideup/php:8.4-fpm-nginx-alpine

# Switch to root for installation and setup
USER root

# Install required PHP extensions
# intl: Internationalization support (required by Laravel)
RUN install-php-extensions intl

# Set working directory
WORKDIR /var/www/html

# Copy Composer dependencies from stage 1
COPY --from=composer-dependencies --chown=www-data:www-data /app/vendor ./vendor

# Copy built frontend assets from stage 2
COPY --from=frontend-build --chown=www-data:www-data /app/public/build ./public/build

# Copy application code
# .dockerignore ensures only necessary files are included
COPY --chown=www-data:www-data . .

# Set proper permissions for Laravel
# storage: Logs, cache, sessions, uploaded files
# bootstrap/cache: Compiled views and route cache
RUN chmod -R 755 storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

# Run Composer scripts that were skipped in stage 1
# This includes package discovery and asset publishing
RUN composer run-script post-autoload-dump

# Switch to www-data user for security
# Application runs as non-root user
USER www-data

# Health check to ensure the application is running
# Checks if nginx is responding to requests
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/ || exit 1
