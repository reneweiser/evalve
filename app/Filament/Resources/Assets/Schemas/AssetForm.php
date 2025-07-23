<?php

namespace App\Filament\Resources\Assets\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class AssetForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')->required(),
                Select::make('type')
                    ->required()
                    ->live()
                    ->disabledOn('edit')
                    ->options([
                        'unity_asset_bundle' => 'Unity Asset Bundle',
                        'gltf_glb' => 'glTF/GLB',
                    ]),
                Section::make('Unity AssetBundle')
                    ->statePath('properties')
                    ->visible(fn (Get $get) => $get('type') === 'unity_asset_bundle')
                    ->schema([
                        FileUpload::make('bundle')
                            ->directory('unity_asset_bundles')
                            ->disk('local'),
                        FileUpload::make('manifest')
                            ->directory('unity_asset_bundles')
                            ->disk('local'),
                    ]),
                Section::make('glTF/GLB')
                    ->statePath('properties')
                    ->visible(fn (Get $get) => $get('type') === 'gltf_glb')
                    ->schema([
                        FileUpload::make('glb')
                            ->directory('glb')
                            ->disk('local'),
                    ]),
            ]);
    }
}
