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
    public static function make(string $teamId): Tabs\Tab
    {
        return Tabs\Tab::make(__('moderator.pois'))
            ->columns(4)
            ->schema([
                self::buildPoiSelectionSection($teamId),
                self::buildPoiDetailsSection(),
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
                    ->options(SceneObject::where('team_id', $teamId)->pluck('name', 'id')),
            ]);
    }

    private static function buildPoiDetailsSection(): Section
    {
        return Section::make('')
            ->columnSpan(3)
            ->contained(false)
            ->schema(function (Get $get): array {
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

                return self::buildPoiContent($sceneObject);
            });
    }

    private static function buildPoiContent(SceneObject $sceneObject): array
    {
        $questions = Question::whereIn('id', $sceneObject->getProperties(PropertyType::question)->pluck('questionId'))
            ->pluck('text', 'id')
            ->all();

        $sections = [];
        $sections[] = PoiHeaderSection::make($sceneObject);

        foreach ($sceneObject->getProperties(PropertyType::question) as $questionData) {
            $sections[] = QuestionSection::make($questionData, $questions);
        }

        foreach ($sceneObject->getProperties(PropertyType::pollingField) as $pollingFieldData) {
            $sections[] = PollingSection::make($sceneObject, $pollingFieldData);
        }

        return $sections;
    }
}
