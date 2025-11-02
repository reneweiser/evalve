<?php

namespace App\Filament\Pages\ModeratorView\Schemas;

use App\Filament\Pages\ModeratorView\Services\SceneObjectDispatcher;
use App\Filament\Pages\ModeratorView\ValueObjects\ModelVisibilityData;
use Filament\Forms\Components\ToggleButtons;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Text;
use Filament\Support\Enums\TextSize;

class ModelsTabSchema
{
    public static function make(array $modelGroups): Tabs\Tab
    {
        return Tabs\Tab::make(__('moderator.models'))
            ->schema([
                Text::make(__('moderator.show_hide_models_individually'))
                    ->size(TextSize::Large),
                ToggleButtons::make('models')
                    ->label(__('moderator.show_models'))
                    ->multiple()
                    ->live()
                    ->afterStateUpdated(function ($state, $component) use ($modelGroups) {
                        $visibility = ModelVisibilityData::fromModels($state ?? []);
                        $modelString = $visibility->asToggleString($modelGroups);

                        $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                        $dispatcher->dispatchModelSelected($modelString);
                    })
                    ->options($modelGroups),
            ]);
    }
}
