<?php

namespace App\Filament\Resources\SceneObjects\Pages;

use App\Evalve\Consensive\PoiConverter;
use App\Evalve\Consensive\Vr4MorePoiService;
use App\Evalve\SceneObjectSettings;
use App\Filament\Resources\SceneObjects\SceneObjectResource;
use App\Models\SceneObject;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\CreateAction;
use Filament\Facades\Filament;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ViewField;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\FusedGroup;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Text;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Wizard\Step;
use Filament\Support\Exceptions\Halt;
use Illuminate\Support\Facades\Storage;

class ListSceneObjects extends ListRecords
{
    protected static string $resource = SceneObjectResource::class;

    public ?array $vr4moreComparison = null;

    public bool $hasVr4MoreOnlyPois = false;

    public array $selectedPoiIds = [];

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
            Action::make('settings')
                ->fillForm(fn (): array => SceneObjectSettings::get())
                ->schema([
                    Section::make('Avatar Webview')
                        ->schema([
                            FusedGroup::make([
                                TextInput::make('width')
                                    ->prefix('Width')
                                    ->numeric(),
                                TextInput::make('height')
                                    ->prefix('Height')
                                    ->numeric(),
                                TextInput::make('zoom')
                                    ->prefix('Zoom')
                                    ->numeric(),
                            ])->columns(3),
                        ]),
                    Repeater::make('modelGroups')
                        ->schema([
                            TextInput::make('name'),
                        ]),
                ])
                ->action(function (array $data) {
                    SceneObjectSettings::set($data);
                }),
            $this->getPushToConsensiveWizardAction(),
            ActionGroup::make([
                Action::make('fromApi')
                    ->label('From API')
                    ->disabled()
                    ->tooltip('Disabled: More testing needed')
                    ->action(function (Vr4MorePoiService $service) {
                        $pois = collect($service->getPois()['pois'])
                            ->map(fn ($poi) => PoiConverter::fromVr4MorePoi($poi));

                        foreach ($pois as $poi) {
                            SceneObject::updateOrCreateWithPropertyMerge(
                                ['name' => $poi['name']],
                                $poi
                            );
                        }
                    }),
                Action::make('fromFile')
                    ->label('From File')
                    ->disabled()
                    ->tooltip('Disabled: More testing needed')
                    ->schema([
                        FileUpload::make('json_file')
                            ->disk('local'),
                    ])
                    ->action(function (array $data): void {
                        $fileContents = Storage::disk('local')->get($data['json_file']);
                        $jsonData = json_decode($fileContents, true);
                        $pois = collect($jsonData['pois'] ?? [])
                            ->map(fn ($poi) => PoiConverter::fromVr4MorePoi($poi));

                        foreach ($pois as $poi) {
                            SceneObject::updateOrCreateWithPropertyMerge(
                                ['name' => $poi['name']],
                                $poi
                            );
                        }
                    }),
            ])
                ->button()

                ->label('Import POIs'),
        ];
    }

    protected function getPushToConsensiveWizardAction(): Action
    {
        return Action::make('Push to Consensive')
            ->modalWidth('5xl')
//            ->modifyWizardUsing(fn ($wizard) => $wizard->previousAction(fn ($action) => $action->hidden()))
            ->steps([
                Step::make('Select POIs')
                    ->description('Choose which POIs to synchronize with VR4More')
                    ->schema([
                        Select::make('pois')
                            ->label('Select POIs to push')
                            ->multiple()
                            ->required()
                            ->options(Filament::getTenant()->sceneObjects()->pluck('name', 'id'))
                            ->hintAction(fn (Select $component) => Action::make('select_all')
                                ->label('Select All')
                                ->action(fn () => $component->state(
                                    Filament::getTenant()->sceneObjects()->pluck('id')->toArray()
                                ))
                            ),
                    ])
                    ->afterValidation(function (Get $get, Vr4MorePoiService $service) {
                        try {
                            // Fetch selected POIs
                            $selectedPois = SceneObject::query()
//                                ->whereIn('id', $get('pois'))
                                ->get();

                            // Get comparison from VR4More
                            $comparison = $service->comparePois($selectedPois);

                            // Store in component properties
                            $this->vr4moreComparison = $comparison;
                            $this->selectedPoiIds = $get('pois');
                            $this->hasVr4MoreOnlyPois = count($comparison['only_in_vr4more']) > 0;
                        } catch (\Exception $e) {
                            Notification::make()
                                ->title('Failed to fetch VR4More POIs')
                                ->body($e->getMessage())
                                ->danger()
                                ->send();

                            throw new Halt;
                        }
                    }),

                Step::make('Import from VR4More')
                    ->description('POIs found in VR4More that don\'t exist in Evalve')
//                    ->visible(fn () => $this->hasVr4MoreOnlyPois)
                    ->schema([
                        ViewField::make('import_preview')
                            ->view('filament.components.vr4more-import-preview')
                            ->viewData(fn () => [
                                'pois' => $this->vr4moreComparison['only_in_vr4more'] ?? [],
                            ]),
                        Checkbox::make('confirm_import')
                            ->label('Import these POIs from VR4More before pushing')
                            ->default(true),
                    ])
                    ->afterValidation(function (Get $get) {
                        if ($get('confirm_import') ?? true) {
                            $pois = collect($this->vr4moreComparison['only_in_vr4more'] ?? [])
                                ->map(fn ($poi) => PoiConverter::fromVr4MorePoi($poi));

                            foreach ($pois as $poi) {
                                SceneObject::updateOrCreateWithPropertyMerge(
                                    ['name' => $poi['name']],
                                    $poi
                                );
                            }

                            Notification::make()
                                ->title('Imported '.count($pois).' POIs from VR4More')
                                ->success()
                                ->send();
                        }
                    }),

                Step::make('Review Changes')
                    ->description('Review conflicts and confirm synchronization')
                    ->schema(function () {
                        $comparison = $this->vr4moreComparison ?? [];

                        return [
                            Section::make('Summary')
                                ->schema([
                                    ViewField::make('summary')
                                        ->view('filament.components.vr4more-sync-summary')
                                        ->viewData([
                                            'identical_count' => count($comparison['identical'] ?? []),
                                            'conflicts_count' => count($comparison['conflicts'] ?? []),
                                            'new_count' => count($comparison['only_in_evalve'] ?? []),
                                        ]),
                                ]),

                            Section::make('✓ Identical POIs ('.count($comparison['identical'] ?? []).')')
                                ->schema([
                                    Placeholder::make('identical_list')
                                        ->content(implode(', ', $comparison['identical'] ?? [])),
                                ])
                                ->collapsed()
                                ->collapsible()
                                ->visible(fn () => count($comparison['identical'] ?? []) > 0),

                            Section::make('⚠️ POIs with Conflicts ('.count($comparison['conflicts'] ?? []).')')
                                ->schema(function () use ($comparison) {
                                    return collect($comparison['conflicts'] ?? [])
                                        ->map(function ($conflict) {
                                            return ViewField::make('summary')
                                                ->view('filament.components.vr4more-push-conflicts')
                                                ->viewData([
                                                    'name' => $conflict['name'] ?? [],
                                                    'conflicts' => json_encode($conflict['differences'] ?? [], JSON_PRETTY_PRINT),
                                                ]);
                                        })
                                        ->toArray();
                                })
                                ->visible(fn () => count($comparison['conflicts'] ?? []) > 0),

                            Section::make('+ New POIs to Create ('.count($comparison['only_in_evalve'] ?? []).')')
                                ->schema([
                                    Placeholder::make('new_pois')
                                        ->content(function () use ($comparison) {
                                            return collect($comparison['only_in_evalve'] ?? [])
                                                ->pluck('name')
                                                ->implode(', ');
                                        }),
                                ])
                                ->visible(fn () => count($comparison['only_in_evalve'] ?? []) > 0),

                            Checkbox::make('understand_overwrite')
                                ->label('I understand that Evalve\'s state will overwrite VR4More for all conflicting POIs')
                                ->required()
                                ->accepted(),
                        ];
                    }),

            ])
            ->action(function (Vr4MorePoiService $service) {
                try {
                    // Fetch selected POIs (including newly imported ones)
                    $pois = SceneObject::query()
                        ->whereIn('id', $this->selectedPoiIds)
                        ->get()
                        ->map(fn ($poi) => PoiConverter::toVr4MorePoi($poi))
                        ->toArray();

                    // Push to VR4More
                    $response = $service->pushPois($pois);

                    if (! $response->successful()) {
                        Notification::make()
                            ->title('Push failed')
                            ->body('VR4More responded: '.$response->reason())
                            ->danger()
                            ->send();

                        return;
                    }

                    Notification::make()
                        ->title('Successfully pushed to VR4More')
                        ->body(count($pois).' POIs synchronized')
                        ->success()
                        ->send();
                } catch (\Exception $e) {
                    Notification::make()
                        ->title('Push failed')
                        ->body($e->getMessage())
                        ->danger()
                        ->send();
                } finally {
                    // Cleanup component properties
                    $this->vr4moreComparison = null;
                    $this->hasVr4MoreOnlyPois = false;
                    $this->selectedPoiIds = [];
                }
            });
    }
}
