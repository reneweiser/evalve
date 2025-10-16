<?php

namespace App\Filament\Pages;

use App\Filament\Forms\Components\ContentBlock;
use App\Filament\Forms\Components\PublishQuestion;
use App\Filament\Forms\Components\SemanticDifferential;
use App\Models\SceneObject;
use App\Models\Team;
use Filament\Actions\Action;
use Filament\Facades\Filament;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\Page;
use Filament\Pages\SimplePage;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;

class ModeratorView extends SimplePage implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.moderator-view';
    public array $data = [];

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Tabs::make('Moderator Panel')
                    ->tabs([
                        Tabs\Tab::make('Szene')
                            ->schema([
                                Action::make('open_moderator_panel_in_scene'),
                                Action::make('close_all_questions'),
                                Action::make('refresh_pois'),
                            ]),
                        Tabs\Tab::make('Pois')
                            ->schema([
                                Radio::make('pois')
                                    ->options(SceneObject::where('team_id', '01k4me8csqakbm0mf00a2vp666')->pluck('name', 'id'))
                            ]),
                        Tabs\Tab::make('Fragen')
                            ->schema([
                                PublishQuestion::make('frage_1')
                                    ->label('Single Choice')
                                    ->question('Würden Sie unabhängig des ÖPNV Angebots den Bahnhof benutzen?'),
                                PublishQuestion::make('frage_2')
                                    ->label('Multiple Choice')
                                    ->question('Wie finden Sie den Bahnhof?'),
                                PublishQuestion::make('frage_3')
                                    ->label('Semantic Differential')
                                    ->question('Was braucht, aus Ihrer Sicht, der jetzige Bahnhof aktuell am meisten?'),
                            ]),
                        Tabs\Tab::make('Model')
                            ->schema([
                                ToggleButtons::make('models')
                                    ->multiple()
                                    ->options([
                                        'Umgebung' => 'Umgebung',
                                        'sdlkj' => 'Bahnhof',
                                        'sk' => 'Busbahnhof - Opt3',
                                        '5fj' => 'Tunnel - Durchbruch',
                                    ])
                            ]),
                        Tabs\Tab::make('Notizen')
                            ->schema([
                                ContentBlock::make('notes')
                            ])
                    ]),
            ]);
    }
}
