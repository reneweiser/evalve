# Agent Guidelines for Evalve

## Tech Stack
Laravel 12, PHP 8.2+, Filament 4, Livewire, Vite, Tailwind CSS 4

## Build/Test/Lint Commands
- `composer test` - Run all tests
- `php artisan test --filter=TestName` - Run single test
- `vendor/bin/phpunit tests/Feature/SpecificTest.php` - Run specific test file
- `./vendor/bin/pint` - Format PHP code (Laravel Pint)
- `npm run build` - Build frontend assets
- `composer dev` - Start dev server (includes server, queue, logs, vite)

## Code Style
- **Imports**: Group by namespace (Illuminate first, App after), alphabetically within groups
- **Types**: Strict typing - use property/return types (`?string`, `int`, `void`, arrays as `array`)
- **Naming**: PascalCase for classes, camelCase for methods/properties, snake_case for DB columns
- **Formatting**: PSR-12 standard (Pint enforces), 4 spaces indent, blank line after namespace
- **Error Handling**: Use try-catch blocks, return JSON responses with `success`, `message` keys
- **Models**: Use traits (HasUlids, HasTeam), Eloquent relationships, mass assignment protection
- **Filament**: Separate schema/table classes (e.g., ProjectForm, ProjectsTable), static make() methods
- **Tests**: Use PHPUnit, snake_case test methods prefixed with `test_`, descriptive names
