<?php

namespace App\Filament\Pages\ModeratorView\Schemas;

use App\Filament\Pages\ModeratorView\Services\SceneObjectDispatcher;
use Filament\Actions\Action;
use Filament\Schemas\Components\Tabs;
use Filament\Support\Icons\Heroicon;

class SettingsTabSchema
{
    public static function make(): Tabs\Tab
    {
        return Tabs\Tab::make('')
            ->icon(Heroicon::Cog)
            ->schema([
                Action::make('open_moderator_panel_in_scene')
                    ->disabled(),
                Action::make('close_all_questions')
                    ->disabled(),
                Action::make('refresh_pois')
                    ->action(function ($component) {
                        $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                        $dispatcher->dispatchRefreshPois();
                    }),
            ]);
    }
}
