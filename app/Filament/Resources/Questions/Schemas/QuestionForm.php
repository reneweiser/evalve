<?php

namespace App\Filament\Resources\Questions\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class QuestionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Textinput::make('text')
                    ->required(),
                Select::make('type')
                    ->live()
                    ->required()
                    ->options([
                        'semantic_differential' => 'Semantic Differential',
                        'single_choice' => 'Single Choice',
                        'multiple_choice' => 'Multiple Choice',
                        'image' => 'Image',
                    ]),
                Section::make('Semantic Differential')
                    ->contained(false)
                    ->visible(fn (Get $get) => $get('type') === 'semantic_differential')
                    ->statePath('properties')
                    ->schema([
                        TextInput::make('size')
                            ->numeric()
                            ->default(3)
                            ->required(),
                        Repeater::make('items')
                            ->columns(2)
                            ->schema([
                                TextInput::make('label_a'),
                                TextInput::make('label_b'),
                            ]),
                    ]),
                Section::make('Single Choice')
                    ->contained(false)
                    ->visible(fn (Get $get) => $get('type') === 'single_choice')
                    ->statePath('properties')
                    ->schema([
                        Repeater::make('options')
                            ->schema([TextInput::make('option')]),
                    ]),
                Section::make('Multiple Choice')
                    ->contained(false)
                    ->visible(fn (Get $get) => $get('type') === 'multiple_choice')
                    ->statePath('properties')
                    ->schema([
                        Repeater::make('options')
                            ->schema([TextInput::make('option')]),
                    ]),
                Section::make('Image')
                    ->contained(false)
                    ->visible(fn (Get $get) => $get('type') === 'image')
                    ->statePath('properties')
                    ->schema([
                        FileUpload::make('image_path')
                            ->label('Image')
                            ->disk('public')
                            ->directory('questions')
                            ->image()
                            ->maxSize(5120)
                            ->required(),
                    ]),
            ]);
    }
}
