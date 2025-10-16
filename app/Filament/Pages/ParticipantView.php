<?php

namespace App\Filament\Pages;

use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\Page;
use Filament\Pages\SimplePage;
use Filament\Schemas\Schema;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\HtmlString;

class ParticipantView extends SimplePage implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.participant-view';

    public function getTitle(): string|Htmlable
    {
        return 'Würden Sie unabhängig des ÖPNV Angebots den Bahnhof benutzen?';
    }

    public function form(Schema $schema): Schema
    {
        return $schema->schema([
            ToggleButtons::make('publishForms')
                ->label('Ihre Antwort')
                ->grouped()
                ->options([
                    1 => 'ja',
                    2 => 'eher ja',
                    3 => 'eher nein',
                    4 => 'nein',
                ])
        ]);
    }
}
