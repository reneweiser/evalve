<?php

namespace App\Evalve\FormComponents;

use App\Models\Asset;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;

class VariantComparison
{
    public static function make()
    {
        return [
            TextInput::make('label'),
            Repeater::make('variants')
                ->schema([
                    \Filament\Forms\Components\Select::make('variant')
                        ->options(Asset::query()->pluck('name', 'id')),
                ])
        ];
    }
}
