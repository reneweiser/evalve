<?php

namespace App\Filament\Resources\SceneObjects\Schemas;

use Filament\Forms\Components\Builder;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\FusedGroup;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class SceneObjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                TextInput::make('name')->required(),
                FusedGroup::make([
                    TextInput::make('position_x')
                        ->numeric()
                        ->prefix('x')
                        ->required(),
                    TextInput::make('position_y')
                        ->numeric()
                        ->prefix('y')
                        ->required(),
                    TextInput::make('position_z')
                        ->numeric()
                        ->prefix('z')
                        ->required(),
                ])
                    ->label('Position')
                    ->columns(3),
                Builder::make('properties')
                    ->blocks([
                        Builder\Block::make('checkpoint')
                            ->schema([
                                TextInput::make('orientation')
                                    ->numeric()
                                    ->required(),
                            ])
                    ]),
            ]);
    }
}
