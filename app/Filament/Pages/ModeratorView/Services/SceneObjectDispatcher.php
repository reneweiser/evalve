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

    /**
     * Open a webview in the VR scene with the given URL.
     *
     * The URL can contain placeholder values like $USERNAME$ and $ROLE$
     * which will be substituted by the VR client with actual user values.
     */
    public function dispatchOpenWebview(string $url): void
    {
        $this->livewire->dispatch('open-webview', [
            'value' => [
                'url' => $url,
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

    public function dispatchCloseAllWebviews(): void
    {
        $this->livewire->dispatch('close-all-webviews');
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

    public function dispatchShowBillboard(QuestionData $questionData, string $billboardUrl): void
    {
        $this->livewire->dispatch('show-billboard', [
            'value' => [
                'url' => $billboardUrl,
                'data' => $questionData->billboardSettings,
            ],
        ]);
    }

    public function dispatchHideBillboard(): void
    {
        $this->livewire->dispatch('hide-billboard');
    }
}
