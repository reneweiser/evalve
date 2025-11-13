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
        $actions = [
            Action::make('open_moderator_panel_in_scene')
                ->disabled(),
            Action::make('close_all_webviews')
                ->action(function ($component) {
                    $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                    $dispatcher->dispatchCloseAllWebviews();
                }),
            Action::make('refresh_pois')
                ->action(function ($component) {
                    $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                    $dispatcher->dispatchRefreshPois();
                }),
        ];

        // Add test webview action in local environment only
        if (app()->environment('local')) {
            array_unshift($actions, Action::make('open_test_page')
                ->label('Test VR Webview')
                ->action(function ($component) {
                    $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                    $dispatcher->dispatchOpenWebview('https://dev.vr4more.com/dan/bpl/test_content.html?userAlias=$USERNAME$&userRole=$ROLE$');
                }));
        }

        return Tabs\Tab::make('')
            ->icon(Heroicon::Cog)
            ->schema($actions);
    }
}
