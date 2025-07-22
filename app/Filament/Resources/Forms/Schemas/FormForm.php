<?php

namespace App\Filament\Resources\Forms\Schemas;

use Filament\Forms\Components\Builder;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class FormForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                TextInput::make('name')
                    ->required(),
                Repeater::make('fields')
                    ->label('Pages')
                    ->collapsible()
                    ->collapsed()
                    ->schema([
                        TextInput::make('page_title')
                            ->required(),
                        Builder::make('page_content')
                            ->collapsible()
                            ->collapsed()
                            ->blocks([
                                Builder\Block::make('text')
                                    ->schema([
                                        MarkdownEditor::make('content')
                                            ->toolbarButtons([
                                                ['heading'],
                                                ['bold', 'italic', 'strike'],
                                            ]),
                                    ]),
                                Builder\Block::make('select')
                                    ->schema([
                                        TextInput::make('label')
                                            ->required(),
                                        Repeater::make('options')
                                            ->minItems(2)
                                            ->schema([
                                                TextInput::make('option')
                                            ])
                                    ])
                            ])
                    ]),
            ]);
    }
}
