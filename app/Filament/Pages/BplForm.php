<?php

namespace App\Filament\Pages;

use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\SimplePage;
use Filament\Schemas\Schema;

class BplForm extends SimplePage implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.bpl-form';
    public $data = [
        'options' => '',
        'poi' => '',
        'webview' => '',
    ];

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                Select::make('options')
                    ->afterStateUpdated(function ($state, $component) {
                        $component->getLivewire()->dispatch('model-options-changed', ['value' => $state]);
                    })
                    ->multiple()
                    ->live(onBlur: true)
                    ->options([
                        'Bahnhof' => 'mit Bahnhof',
                        'Umgebung' => 'mit Umgebung',
                        'Busbahnhof - Opt3' => 'Busbahnhof',
                        'Tunnel - Durchbruch' => 'Tunnel Durchbruch',
                    ]),
                Select::make('poi')
                    ->afterStateUpdated(function ($state, $component) {
                        $component->getLivewire()->dispatch('poi-selected', ['value' => $state]);
                    })
                    ->live()
                    ->options([
                        '8_4 Treppen Nord' => '8_4 Treppen Nord',
                        '1_0 Bahnhofshalle' => '1_0 Bahnhofshalle',
                    ]),
                Select::make('webview')
                    ->afterStateUpdated(function ($state, $component) {
                        $component->getLivewire()->dispatch('webview-opened', ['value' => $state]);
                    })
                    ->live()
                    ->options([
                        'https://google.com' => 'Google',
                        'https://uni-weimar.de' => 'Uni Weimar',
                        'http://localhost/bpl-test' => 'Form',
                    ]),
            ]);
    }
}
