<?php

namespace App\Filament\Pages\ModeratorView\ValueObjects;

use App\Evalve\SceneObjectSettings;

class ModelVisibilityData
{
    public function __construct(
        public readonly array $selectedModels
    ) {}

    public static function fromModels(array $models): self
    {
        return new self($models);
    }

    public function asString(): string
    {
        return SceneObjectSettings::asString($this->selectedModels);
    }

    public function asToggleString(array $allModelGroups): string
    {
        return collect($allModelGroups)
            ->map(fn (string $group): string => in_array($group, $this->selectedModels) ? "+$group" : "-$group")
            ->values()
            ->join(',');
    }
}
