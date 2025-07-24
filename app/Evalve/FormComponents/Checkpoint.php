<?php

namespace App\Evalve\FormComponents;

use Filament\Forms\Components\TextInput;

class Checkpoint
{
    public static function make()
    {
        return [
            TextInput::make('perimeter')
                ->numeric()
                ->required(),
        ];
    }
}
