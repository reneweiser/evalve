<?php

namespace App\Filament\Pages\ModeratorView\Services;

use App\Filament\Pages\ModeratorView\ValueObjects\ModelVisibilityData;
use App\Filament\Pages\ModeratorView\ValueObjects\PollingFieldData;
use App\Filament\Pages\ModeratorView\ValueObjects\QuestionData;
use App\Models\SceneObject;
use Livewire\Component;

class SceneObjectDispatcher
{
    public function __construct(
        private readonly Component $livewire
    ) {}

    public function dispatchPoiSelected(SceneObject $sceneObject, array $models): void
    {
        $visibility = ModelVisibilityData::fromModels($models);

        $this->livewire->dispatch('poi-selected', [
            'value' => [
                'poiName' => $sceneObject->name,
                'visibility' => $visibility->asString(),
            ],
        ]);
    }

    public function dispatchModelSelected(string $modelString): void
    {
        $this->livewire->dispatch('model-selected', [
            'value' => $modelString,
        ]);
    }

    public function dispatchOpenQuestion(QuestionData $questionData, string $participantUrl): void
    {
        $this->livewire->dispatch('open-question', [
            'value' => [
                'participantView' => $participantUrl,
                'billboardSettings' => $questionData->billboardSettings,
            ],
        ]);
    }

    public function dispatchCloseWebview(QuestionData $questionData, string $participantUrl): void
    {
        $this->livewire->dispatch('close-webview', [
            'value' => [
                'participantView' => $participantUrl,
                'billboardSettings' => $questionData->billboardSettings,
            ],
        ]);
    }

    public function dispatchOpenPolling(PollingFieldData $pollingData, string $pollingUrl): void
    {
        $this->livewire->dispatch('open-polling', [
            'value' => [
                'pollingView' => $pollingUrl,
                'data' => $pollingData->data,
            ],
        ]);
    }

    public function dispatchClosePolling(): void
    {
        $this->livewire->dispatch('close-polling');
    }

    public function dispatchRefreshPois(): void
    {
        $this->livewire->dispatch('refresh-pois');
    }
}
