<?php

namespace App\Filament\Pages\ModeratorView\Sections;

use App\Filament\Pages\ModeratorView\Services\SceneObjectDispatcher;
use App\Filament\Pages\ModeratorView\ValueObjects\PollingFieldData;
use App\Models\PropertyType;
use App\Models\SceneObject;
use Filament\Actions\Action;
use Filament\Schemas\Components\Image;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Text;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Storage;

class PollingSection
{
    public static function make(SceneObject $sceneObject): Section
    {
        $property = $sceneObject->getProperty(PropertyType::pollingField);
        $pollingData = PollingFieldData::fromArray($property ?? []);

        return Section::make(__('moderator.public_voting'))
            ->visible(fn (): bool => ! empty($property))
            ->icon(Heroicon::UserGroup)
            ->key($sceneObject->id.'polling')
            ->footer([
                self::buildOpenAction($sceneObject, $pollingData),
                self::buildCloseAction($sceneObject),
            ])
            ->schema([
                Text::make($pollingData->data['name'] ?? ''),
                Image::make(
                    url: Storage::disk('public')->url($pollingData->image),
                    alt: 'Polling Field'
                ),
            ]);
    }

    private static function buildOpenAction(SceneObject $sceneObject, PollingFieldData $pollingData): Action
    {
        return Action::make('openPolling')
            ->label(__('moderator.open'))
            ->action(function ($component) use ($pollingData) {
                $pollingUrl = route('public.polling', ['image' => $pollingData->image]);
                $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                $dispatcher->dispatchOpenPolling($pollingData, $pollingUrl);
            });
    }

    private static function buildCloseAction(SceneObject $sceneObject): Action
    {
        return Action::make('closePolling')
            ->label(__('moderator.close'))
            ->action(function ($component) {
                $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                $dispatcher->dispatchClosePolling();
            });
    }
}
