<?php

namespace App\Evalve\FormComponents;

use App\Evalve\SceneObjectSettings;
use App\Models\SceneObject;
use Filament\Forms\Components\CodeEditor;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;

class CGData
{
    public static function make(): array
    {
        $options = collect(SceneObjectSettings::get()['modelGroups'])
            ->mapWithKeys(fn ($item) => [$item['name'] => $item['name']]);
        return [
            TextInput::make('id')
                ->numeric()
                ->label('POI ID')
                ->disabled(),
            TextInput::make('title'),
            TextInput::make('order')->numeric(),
            TextInput::make('dwellTime')->numeric(),
            \Filament\Forms\Components\Select::make('blacklists')
                ->multiple()
                ->options($options),
            \Filament\Forms\Components\Select::make('passthrough')
                ->selectablePlaceholder(false)
                ->options([
                    0 => '0 - Keep as is',
                    1 => '1 - Off (VR)',
                    2 => '2 - ON (Mixed Reality)',
                ]),
            Repeater::make('transitions')
                ->collapsible()
                ->collapsed()
                ->itemLabel(fn (array $state) => $state['fromPoiId'].' -> '.$state['toPoiId'])
                ->schema([
                    \Filament\Forms\Components\Select::make('fromPoiId')
                        ->selectablePlaceholder(false)
                        ->options(SceneObject::pluck('name', 'name')),
                    \Filament\Forms\Components\Select::make('toPoiId')
                        ->selectablePlaceholder(false)
                        ->options(SceneObject::pluck('name', 'name')),
                    \Filament\Forms\Components\Select::make('role')
                        ->selectablePlaceholder(false)
                        ->default('Default')
                        ->options([
                            'Default' => 'Default',
                            'Default-HMD' => 'Default-HMD',
                            'Moderator' => 'Moderator',
                        ]),
                    TextInput::make('time')
                        ->type('number'),
                    CodeEditor::make('cameraPath')
                        ->extraAttributes(['style' => 'max-height: 25rem; overflow-y: scroll;'])
                        ->afterStateHydrated(fn ($component, $state) => $component->state(json_encode($state, JSON_PRETTY_PRINT)))
                        ->dehydrateStateUsing(fn ($state): array => json_decode($state, true) ?? [])
                        ->language(CodeEditor\Enums\Language::Json),
                ]),
        ];
    }
}
