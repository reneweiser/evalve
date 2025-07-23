<?php

namespace App\Filament\Resources\Forms\Schemas;

use App\Evalve\FormComponents\Rating;
use App\Evalve\FormComponents\Select;
use App\Evalve\FormComponents\Text;
use App\Evalve\FormComponents\VariantComparison;
use Filament\Forms\Components\Builder;
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
                            ->label('Fields')
                            ->collapsible()
                            ->collapsed()
                            ->blocks([
                                Builder\Block::make('text') ->schema(Text::make()),
                                Builder\Block::make('select') ->schema(Select::make()),
                                Builder\Block::make('rating')->schema(Rating::make()),
                                Builder\Block::make('variant_comparison')->schema(VariantComparison::make()),
                            ])
                    ]),
            ]);
    }
}
