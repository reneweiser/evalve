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
                TextInput::make('survey_point_position_x')
                    ->numeric()
                    ->prefix('x')
                    ->required(),
                TextInput::make('survey_point_position_y')
                    ->numeric()
                    ->prefix('y')
                    ->required(),
                TextInput::make('survey_point_position_z')
                    ->numeric()
                    ->prefix('z')
                    ->required(),
            ])
                ->label('Survey Point')
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
