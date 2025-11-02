<?php

namespace App\Filament\Pages\ModeratorView\ValueObjects;

class QuestionData
{
    public function __construct(
        public readonly string $questionId,
        public readonly array $models,
        public readonly array $billboardSettings
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            questionId: $data['questionId'] ?? '',
            models: $data['models'] ?? [],
            billboardSettings: $data
        );
    }

    public function hasModels(): bool
    {
        return ! empty($this->models);
    }
}
