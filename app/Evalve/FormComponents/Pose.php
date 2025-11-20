<?php

namespace App\Evalve\FormComponents;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\FusedGroup;
use Filament\Schemas\Components\Utilities\Set;
use Illuminate\Support\Str;

class Pose
{
    public static function make()
    {
        return [
            TextInput::make('id')
                ->default(fn () => Str::uuid()->toString())
                ->afterStateHydrated(function (Set $set, ?string $state) {
                    if ($state === null) {
                        $set('id', Str::uuid()->toString());
                    }
                })
                ->disabled()
                ->dehydrated(),
            \Filament\Forms\Components\Select::make('role')
                ->required()
                ->selectablePlaceholder(false)
                ->options([
                    'Default' => 'Default',
                    'Default-HMD' => 'Default-HMD',
                ]),
            FusedGroup::make([
                TextInput::make('x')
                    ->numeric()
                    ->prefix('x')
                    ->required(),
                TextInput::make('y')
                    ->numeric()
                    ->prefix('y')
                    ->required(),
                TextInput::make('z')
                    ->numeric()
                    ->prefix('z')
                    ->required(),
            ])
                ->statePath('position')
                ->label('Position')
                ->columns(3),
            FusedGroup::make([
                TextInput::make('x')
                    ->numeric()
                    ->prefix('x')
                    ->required(),
                TextInput::make('y')
                    ->numeric()
                    ->prefix('y')
                    ->required(),
                TextInput::make('z')
                    ->numeric()
                    ->prefix('z')
                    ->required(),
            ])
                ->statePath('rotation')
                ->label('Rotation')
                ->columns(3),
            TextInput::make('scale')
                ->numeric()
                ->required(),
            TextInput::make('referenceCategory'),
            Toggle::make('overrideBlackWhitelists'),
        ];
    }
}
