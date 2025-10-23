<?php

namespace App\Filament\Resources\SceneObjects\Schemas;

use App\Evalve\FormComponents\Billboard;
use App\Evalve\FormComponents\Bim;
use App\Evalve\FormComponents\Body;
use App\Evalve\FormComponents\CGData;
use App\Evalve\FormComponents\Checkpoint;
use App\Evalve\FormComponents\PollingField;
use App\Evalve\FormComponents\Pose;
use App\Evalve\FormComponents\Questions;
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\FusedGroup;
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
                    TextInput::make('x')
                        ->numeric()
                        ->prefix('x')
                        ->required(),
                    TextInput::make('y')
                        ->numeric()
                        ->prefix('y')
                        ->required(),
                    TextInput::make('z')
                        ->numeric()
                        ->prefix('z')
                        ->required(),
                ])
                    ->statePath('transform.position')
                    ->label('Position')
                    ->columns(3),
                FusedGroup::make([
                    TextInput::make('x')
                        ->numeric()
                        ->prefix('x')
                        ->required(),
                    TextInput::make('y')
                        ->numeric()
                        ->prefix('y')
                        ->required(),
                    TextInput::make('z')
                        ->numeric()
                        ->prefix('z')
                        ->required(),
                ])
                    ->statePath('transform.rotation')
                    ->label('Rotation')
                    ->columns(3),
                FileUpload::make('imageUrl')
                    ->label('Thumbnail')
                    ->disk('public')
                    ->directory('thumbnails'),
                Builder::make('properties')
                    ->collapsible()
                    ->collapsed()
                    ->blocks([
                        Builder\Block::make('bim_data')
                            ->maxItems(1)
                            ->schema(Bim::make()),
                        Builder\Block::make('body')
                            ->maxItems(1)
                            ->schema(Body::make()),
                        Builder\Block::make('checkpoint')
                            ->maxItems(1)
                            ->schema(Checkpoint::make()),
                        Builder\Block::make('pose')
                            ->schema(Pose::make()),
                        Builder\Block::make('cgData')
                            ->label('Commonground Data')
                            ->maxItems(1)
                            ->schema(CGData::make()),
                        Builder\Block::make('billboard')
                            ->maxItems(1)
                            ->schema(Billboard::make()),
                        Builder\Block::make('pollingField')
                            ->maxItems(1)
                            ->schema(PollingField::make()),
                        Builder\Block::make('questions')
                            ->maxItems(1)
                            ->schema(Questions::make()),
                    ]),
            ]);
    }
}
