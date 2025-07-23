<?php

namespace App\Evalve\FormComponents;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;

class Select
{
    public static function make()
    {
        return [
            TextInput::make('label')
                ->required(),
            Toggle::make('is_required'),
            Repeater::make('options')
                ->minItems(2)
                ->schema([
                    TextInput::make('option')
                ]),
        ];
    }
}
