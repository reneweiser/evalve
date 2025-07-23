<?php

namespace App\Evalve\FormComponents;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\FusedGroup;

class Rating
{
    public static function make()
    {
        return [
            FusedGroup::make([
                TextInput::make('label_a')
                    ->placeholder('A')
                    ->required(),
                TextInput::make('label_b')
                    ->placeholder('B')
                    ->required(),
            ])
                ->label('Labels')
                ->columns(2),
            Toggle::make('is_required'),
            TextInput::make('size')
                ->numeric()
                ->required(),
        ];
    }
}
