<?php

namespace App\Filament\Pages;

use Filament\Forms\Components\Select;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\SimplePage;
use Filament\Schemas\Schema;

class BplForm extends SimplePage implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.bpl-form';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('variant_0')
                    ->options([
                        '+Bahnhof' => 'mit Bahnhof',
                        '-Bahnhof' => 'ohne Bahnhof',
                    ]),
                Select::make('variant_1')
                    ->options([
                        '+Umgebung' => 'mit Umgebung',
                        '-Umgebung' => 'ohne Umgebung',
                    ]),
                Select::make('poi')
                    ->options([
                        '8_4 Treppen Nord' => '8_4 Treppen Nord',
                        '1_0 Bahnhofshalle' => '1_0 Bahnhofshalle',
                    ]),
                Select::make('webview')
                    ->options([
                        'https://google.com' => 'Google',
                        'https://uni-weimar.de' => 'Uni Weimar',
                        'http://localhost/bpl-test' => 'Form',
                    ]),
            ]);
    }
}
