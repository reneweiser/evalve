<?php

namespace App\Evalve\FormComponents;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;

class CGData
{
    public static function make(): array
    {
        return [
            TextInput::make('id')
                ->type('number')
                ->label('POI ID')
                ->disabled(),
            //            TextInput::make('fixtureReference'),
            //            TextInput::make('order')
            //                ->type('number')
            //                ->disabled(),
            //            Toggle::make('passthrough')
        ];
    }
}
