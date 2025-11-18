<?php

namespace App\Evalve\FormComponents;

use App\Models\Asset;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Get;

class VariantComparison
{
    public static function make()
    {
        $options = Asset::query()
            ->where('type', 'unity_asset_bundle')
            ->pluck('name', 'id');

        return [
            TextInput::make('label'),
            Repeater::make('variants')
                ->schema([
                    TextInput::make('variant_name')
                        ->required(),
                    \Filament\Forms\Components\Select::make('asset_bundle_id')
                        ->label('Select AssetBundle')
                        ->live()
                        ->required()
                        ->options($options),
                    \Filament\Forms\Components\Select::make('assets')
                        ->hidden(fn (Get $get) => $get('asset_bundle_id') === null)
                        ->multiple()
                        ->options(function (Get $get) {
                            $assetBundle = Asset::find($get('asset_bundle_id'));

                            return collect($assetBundle->properties['assets'])
                                ->mapWithKeys(fn ($property) => [$property['name'] => $property['name']]);
                        }),
                ]),
        ];
    }
}
