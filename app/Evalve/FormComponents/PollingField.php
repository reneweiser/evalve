<?php

namespace App\Evalve\FormComponents;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\FusedGroup;

class PollingField
{
    public static function make(): array
    {
        return [
            FusedGroup::make([
                TextInput::make('width')
                    ->numeric()
                    ->prefix('Width')
                    ->required(),
                TextInput::make('height')
                    ->numeric()
                    ->prefix('Height')
                    ->required(),
            ])
                ->statePath('size')
                ->label('Size')
                ->columns(2),
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
        ];
    }
}
