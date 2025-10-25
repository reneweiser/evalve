<?php

namespace App\Filament\Pages;

use App\Evalve\SceneObjectSettings;
use App\Filament\Forms\Components\ContentBlock;
use App\Filament\Forms\Components\PublishQuestion;
use App\Models\Question;
use App\Models\SceneObject;
use App\Models\PropertyType;
use App\Models\Team;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Pages\SimplePage;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmptyState;
use Filament\Schemas\Components\Flex;
use Filament\Schemas\Components\FusedGroup;
use Filament\Schemas\Components\Image;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Text;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Enums\Size;
use Filament\Support\Enums\TextSize;
use Filament\Support\Enums\Width;
use Filament\Support\Icons\Heroicon;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

class ModeratorView extends SimplePage implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.moderator-view';
    protected Width | string | null $maxContentWidth = Width::ScreenExtraLarge;
    public array $data = [
        'models' => [],
        'notes' => [],
    ];
    public array $modelGroups;
    public string $name;
    public string $team;

    public function mount(): void
    {
        $this->name = request()->get('name');
        $this->team = request()->get('team');
        $this->modelGroups = $this->getModelGroups();
    }

    public function hasLogo(): bool
    {
        return false;
    }

    public function getHeading(): string|Htmlable
    {
        return $this->name;
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Tabs::make('Moderator Panel')
                    ->contained(false)
                    ->statePath('data')
                    ->tabs([
                        Tabs\Tab::make('Pois')
                            ->columns(4)
                            ->schema([
                                Section::make('')
                                    ->contained(false)
                                    ->schema([
                                        Radio::make('pois')
                                            ->label('POIs')
                                            ->live()
                                            ->afterStateUpdated(function ($state, $component) {
                                                $sceneObject = SceneObject::find($state);
                                                $component->getLivewire()->dispatch('poi-selected', ['value' => [
                                                    'poiName' => $sceneObject->name,
                                                    'visibility' => SceneObjectSettings::asString($sceneObject->getProperty(PropertyType::models)['models'] ?? []),
                                                ]]);
                                            })
                                            ->options(SceneObject::where('team_id', $this->team)->pluck('name', 'id')),
                                    ]),
                                Section::make('')
                                    ->columnSpan(3)
                                    ->contained(false)
                                    ->schema(function (Get $get, $component): array {
                                        if ($get('pois') === null) return [
                                            EmptyState::make('Kein POI ausgewählt')
                                                ->icon(Heroicon::MapPin)
                                                ->description('Wählen Sie einen POI aus um anzufangen.')
                                        ];

                                        $sceneObject = SceneObject::find($get('pois'));
                                        $questions = Question::whereIn('id', $sceneObject->getProperties(PropertyType::question)->pluck('questionId'))
                                            ->pluck('text', 'id')
                                            ->all();

                                        $r = [];
                                        $r[] = Section::make('POI: '.$sceneObject->name)
                                            ->icon(Heroicon::MapPin)
                                            ->headerActions([
                                                Action::make('openPoiModels')->label('Modelle anzeigen')
                                                    ->outlined()
                                                    ->size(Size::Medium)
                                                    ->icon(Heroicon::BuildingOffice2)
                                                    ->action(function (Section $component) use ($sceneObject) {
                                                        $selectedModels = $sceneObject->getProperty(PropertyType::models)['models'];
                                                        $allModels = SceneObjectSettings::asString($selectedModels);
                                                        $component->getLivewire()->dispatch('model-selected', ['value' => $allModels]);
                                                    }),
                                            ])
                                            ->footer([
                                                Action::make('notes')
                                                    ->schema(function () use ($sceneObject) {
                                                        $property = $sceneObject->getProperty(PropertyType::notes);
                                                        $content = $property ? $property['notes'] : '';
                                                        return [
                                                            Text::make(str($content)->markdown()->toHtmlString())
                                                                ->extraAttributes(['class' => 'fi-prose', 'style' => 'font-size: 1.5rem;'])
                                                        ];
                                                    })
                                                    ->label('Notizen anzeigen')
                                                    ->modalHeading('Notizen')
                                                    ->slideOver()
                                            ]);
                                        foreach ($sceneObject->getProperties(PropertyType::question) as $questionData) {
                                            $r[] = Section::make('Individuelle Abstimmung')
                                                ->key($questionData['questionId'])
                                                ->icon(Heroicon::User)
                                                ->headerActions([
                                                    Action::make('showModels')
                                                        ->label('Modelle anzeigen')
                                                        ->visible(fn () => !empty($questionData['models']))
                                                        ->outlined()
                                                        ->size(Size::Medium)
                                                        ->icon(Heroicon::BuildingOffice2)
                                                        ->action(function (Section $component) use ($questionData) {
                                                            $selectedModels = $questionData['models'];
                                                            $allModels = SceneObjectSettings::asString($selectedModels);
                                                            $component->getLivewire()->dispatch('model-selected', ['value' => $allModels]);
                                                        }),
                                                ])
                                                ->footer([
                                                    Action::make('openQuestion')->label('Öffnen')
                                                        ->action(fn () => $component->getLivewire()->dispatch('open-question', [
                                                            'value' => [
                                                                'participantView' => route('public.participant', ['questionId' => $questionData['questionId']]),
                                                                'billboardSettings' => $questionData,
                                                            ]
                                                        ])),
                                                    Action::make('closeQuestion')->label('Schließen')
                                                        ->action(fn () => $component->getLivewire()->dispatch('close-question', [
                                                            'value' => [
                                                                'participantView' => route('public.participant', ['questionId' => $questionData['questionId']]),
                                                                'billboardSettings' => $questionData,
                                                            ]
                                                        ])),
                                                ])
                                                ->schema([
                                                    Text::make($questions[$questionData['questionId']])
                                                        ->size(TextSize::Large),
                                                ]);
                                        }
                                        $r[] = Section::make('Öffentliche Abstimmung')
                                            ->visible(fn () => !empty($sceneObject->getProperties(PropertyType::pollingField)->toArray()))
                                            ->icon(Heroicon::UserGroup)
                                            ->schema([
                                                Image::make(
                                                    url: Storage::disk('public')->url($sceneObject->getProperty(PropertyType::pollingField)['image'] ?? ''),
                                                    alt: 'Polling Field'
                                                ),
                                                ActionGroup::make([
                                                    Action::make('openPolling')
                                                        ->label('Öffnen')
                                                        ->action(function () use ($component, $sceneObject) {
                                                            $pollingField = $sceneObject->getProperty(PropertyType::pollingField);
                                                            return $component->getLivewire()->dispatch('open-polling', [
                                                                'value' => [
                                                                    'pollingView' => route('public.polling', ['image' => $pollingField['image'],]),
                                                                    'data' => $pollingField,
                                                                ]
                                                            ]);
                                                        }),
                                                    Action::make('closePolling')
                                                        ->label('Schließen'),
                                                ])
                                                    ->buttonGroup()
                                                    ->size(Size::Large)
                                                    ->label('Aktionen zu dieser Frage')
                                            ]);
                                        return $r;
                                    })
                            ]),
                        Tabs\Tab::make('Modelle')
                            ->schema([
                                Text::make('Modelle einzeln ein/ausblenden.')
                                    ->size(TextSize::Large),
                                ToggleButtons::make('models')
                                    ->label('Modelle anzeigen')
                                    ->multiple()
                                    ->live()
                                    ->afterStateUpdated(function ($state, $component) {
                                        $res = collect($this->modelGroups)
                                            ->map(fn ($group) => in_array($group, $state) ? "+$group" : "-$group")
                                            ->values()
                                            ->join(",");
                                        $component->getLivewire()->dispatch('model-selected', ['value' => $res]);
                                    })
                                    ->options($this->getModelGroups())
                            ]),
                        Tabs\Tab::make('')
                            ->icon(Heroicon::Cog)
                            ->schema([
                                Action::make('open_moderator_panel_in_scene'),
                                Action::make('close_all_questions'),
                                Action::make('refresh_pois'),
                            ]),
                    ]),
            ]);
    }

    private function getModelGroups(): array
    {
        return collect(Storage::disk('local')->json('soSettings.json')['modelGroups'])
            ->mapWithKeys(fn($group) => [$group['name'] => $group['name']])
            ->toArray();
    }
}
