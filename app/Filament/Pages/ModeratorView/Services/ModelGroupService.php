<?php

namespace App\Filament\Pages\ModeratorView\Services;

use Illuminate\Support\Facades\Storage;

class ModelGroupService
{
    public function getModelGroups(): array
    {
        $settings = Storage::disk('local')->json('soSettings.json');

        return collect($settings['modelGroups'] ?? [])
            ->mapWithKeys(fn (array $group): array => [
                $group['name'] => $group['name'],
            ])
            ->toArray();
    }

    public function getCachedModelGroups(string $teamId): array
    {
        return cache()->remember(
            "model_groups_{$teamId}",
            3600,
            fn (): array => $this->getModelGroups()
        );
    }
}
