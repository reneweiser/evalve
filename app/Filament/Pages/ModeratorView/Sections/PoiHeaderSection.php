<?php

namespace App\Filament\Pages\ModeratorView\Sections;

use App\Filament\Pages\ModeratorView\Services\SceneObjectDispatcher;
use App\Filament\Pages\ModeratorView\ValueObjects\ModelVisibilityData;
use App\Models\PropertyType;
use App\Models\SceneObject;
use Filament\Actions\Action;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Text;
use Filament\Support\Enums\Size;
use Filament\Support\Icons\Heroicon;

class PoiHeaderSection
{
    public static function make(SceneObject $sceneObject): Section
    {
        return Section::make(__('moderator.poi_label', ['name' => $sceneObject->name]))
            ->icon(Heroicon::MapPin)
            ->key('poi_header-'.$sceneObject->id)
            ->headerActions([
                self::buildModelsAction($sceneObject),
            ])
            ->footer([
                self::buildNotesAction($sceneObject),
            ]);
    }

    private static function buildModelsAction(SceneObject $sceneObject): Action
    {
        return Action::make('openPoiModels')
            ->label(__('moderator.show_models'))
            ->outlined()
            ->size(Size::Medium)
            ->icon(Heroicon::BuildingOffice2)
            ->action(function (Section $component) use ($sceneObject) {
                $selectedModels = $sceneObject->getProperty(PropertyType::models)['models'] ?? [];
                $visibility = ModelVisibilityData::fromModels($selectedModels);

                $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                $dispatcher->dispatchModelSelected($visibility->asString());
            });
    }

    private static function buildNotesAction(SceneObject $sceneObject): Action
    {
        return Action::make('notes')
            ->schema(function () use ($sceneObject) {
                $property = $sceneObject->getProperty(PropertyType::notes);
                $content = $property['notes'] ?? '';

                return [
                    Text::make(str($content)->markdown()->toHtmlString())
                        ->extraAttributes([
                            'class' => 'fi-prose',
                            'style' => 'font-size: 1.5rem;',
                        ]),
                ];
            })
            ->label(__('moderator.show_notes'))
            ->modalHeading(__('moderator.notes'))
            ->slideOver();
    }
}
