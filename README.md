# Evalve

Laravel 12 application for managing evaluation forms and scene objects.

## Requirements

- PHP 8.2+
- Composer
- Node.js & npm

## Setup

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

## Development

```bash
composer dev  # Start dev server (includes server, queue, logs, vite)
```

## Testing

```bash
composer test
```

## Code Formatting

```bash
./vendor/bin/pint
```
