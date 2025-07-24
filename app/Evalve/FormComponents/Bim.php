<?php

namespace App\Evalve\FormComponents;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\FusedGroup;

class Bim
{
    public static function make()
    {
        return [
            TextInput::make('cad_id'),
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
                ->statePath('survey_point_position')
                ->label('Survey Point')
                ->columns(3),
        ];
    }
}
