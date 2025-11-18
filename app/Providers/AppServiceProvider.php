<?php

namespace App\Providers;

use App\Filament\Pages\ModeratorView;
use App\Filament\Pages\ParticipantView;
use Filament\Support\Colors\Color;
use Filament\Support\Facades\FilamentColor;
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::unguard();
        JsonResource::withoutWrapping();

        FilamentView::registerRenderHook(
            PanelsRenderHook::HEAD_END,
            fn (): string => Blade::render('@vite(\'resources/js/app.js\')'),
            scopes: [
                ParticipantView::class,
                ModeratorView::class,
            ]
        );

        if (App::environment('production')) {
            URL::forceHttps();
        }

        view()->composer('filament.pages.*', function () {
            FilamentColor::register([
                'primary' => Color::Sky,
            ]);
        });
    }
}
