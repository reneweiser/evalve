<?php

namespace App\Filament\Resources\Assets\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
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
                    ->columnSpan(2)
                    ->columns(2)
                    ->statePath('properties')
                    ->visible(fn (Get $get) => $get('type') === 'unity_asset_bundle')
                    ->schema([
                        FileUpload::make('bundle')
                            ->disabledOn('edit')
                            ->hiddenOn('edit')
                            ->directory('unity_asset_bundles')
                            ->disk('public'),
                        FileUpload::make('manifest')
                            ->disabledOn('edit')
                            ->hiddenOn('edit')
                            ->directory('unity_asset_bundles')
                            ->disk('local'),
                        TextInput::make('unity_version')
                            ->disabledOn(['create', 'edit'])
                            ->hiddenOn('create'),
                        TextInput::make('crc')
                            ->label('Checksum')
                            ->disabledOn(['create', 'edit'])
                            ->hiddenOn('create'),
                        Repeater::make('assets')
                            ->label('Elements')
                            ->deletable(false)
                            ->reorderable(false)
                            ->addable(false)
                            ->columnSpan(2)
                            ->disabledOn('create')
                            ->hiddenOn('create')
                            ->schema([
                                TextInput::make('name')
                                    ->disabled(),
                            ])
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
