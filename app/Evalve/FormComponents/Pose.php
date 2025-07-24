<?php

namespace App\Evalve\FormComponents;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\FusedGroup;

class Poses
{
    public static function make()
    {
        return [
            TextInput::make('name')->required(),
            FusedGroup::make([
                TextInput::make('position_x')
                    ->numeric()
                    ->prefix('x')
                    ->required(),
                TextInput::make('position_y')
                    ->numeric()
                    ->prefix('y')
                    ->required(),
                TextInput::make('position_z')
                    ->numeric()
                    ->prefix('z')
                    ->required(),
            ])
                ->label('Position')
                ->columns(3),
            FusedGroup::make([
                TextInput::make('rotation_x')
                    ->numeric()
                    ->prefix('x')
                    ->required(),
                TextInput::make('rotation_y')
                    ->numeric()
                    ->prefix('y')
                    ->required(),
                TextInput::make('rotation_z')
                    ->numeric()
                    ->prefix('z')
                    ->required(),
            ])
                ->label('Rotation')
                ->columns(3),
        ];
    }
}
