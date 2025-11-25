<?php

namespace App\Filament\Pages\ModeratorView\Schemas;

use App\Filament\Pages\ModeratorView\Sections\PoiHeaderSection;
use App\Filament\Pages\ModeratorView\Sections\PollingSection;
use App\Filament\Pages\ModeratorView\Sections\QuestionSection;
use App\Filament\Pages\ModeratorView\Services\SceneObjectDispatcher;
use App\Models\PropertyType;
use App\Models\Question;
use App\Models\SceneObject;
use Filament\Forms\Components\Radio;
use Filament\Schemas\Components\EmptyState;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Support\Icons\Heroicon;

class PoisTabSchema
{
    public static function make(string $teamId, string $sessionName): Tabs\Tab
    {
        return Tabs\Tab::make(__('moderator.pois'))
            ->columns(4)
            ->schema([
                self::buildPoiSelectionSection($teamId),
                self::buildPoiDetailsSection($sessionName),
            ]);
    }

    private static function buildPoiSelectionSection(string $teamId): Section
    {
        return Section::make('')
            ->contained(false)
            ->schema([
                Radio::make('pois')
                    ->label(__('moderator.pois'))
                    ->live()
                    ->afterStateUpdated(function ($state, $component) {
                        $sceneObject = SceneObject::find($state);
                        if (! $sceneObject) {
                            return;
                        }

                        $models = $sceneObject->getProperty(PropertyType::models)['models'] ?? [];
                        $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                        $dispatcher->dispatchPoiSelected($sceneObject, $models);
                    })
                    ->options(SceneObject::where('team_id', $teamId)->orderBy('name')->pluck('name', 'id')),
            ]);
    }

    private static function buildPoiDetailsSection(string $sessionName): Section
    {
        return Section::make('')
            ->columnSpan(3)
            ->contained(false)
            ->schema(function (Get $get) use ($sessionName) {
                $poiId = $get('pois');

                if ($poiId === null) {
                    return [
                        EmptyState::make(__('moderator.no_poi_selected'))
                            ->icon(Heroicon::MapPin)
                            ->description(__('moderator.select_poi_to_start')),
                    ];
                }

                $sceneObject = SceneObject::find($poiId);
                if (! $sceneObject) {
                    return [];
                }

                return self::buildPoiContent($sceneObject, $sessionName);
            });
    }

    private static function buildPoiContent(SceneObject $sceneObject, string $sessionName): array
    {
        $questions = Question::whereIn('id', $sceneObject->getProperties(PropertyType::question)->pluck('questionId'))
            ->pluck('text', 'id')
            ->all();

        return $sceneObject->getPropertiesInOrder(PropertyType::question, PropertyType::pollingField)
            ->map(function ($property) use ($sceneObject, $questions, $sessionName) {
                return match ($property['type']) {
                    'question' => QuestionSection::make($property['data'], $questions, $sessionName),
                    'pollingField' => PollingSection::make($sceneObject, $property['data']),
                };
            })
            ->prepend(PoiHeaderSection::make($sceneObject))
            ->values()
            ->toArray();
    }
}
