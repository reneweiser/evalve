<?php

namespace App\Filament\Pages\ModeratorView\ValueObjects;

class PollingFieldData
{
    public function __construct(
        public readonly string $image,
        public readonly array $data
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            image: $data['image'] ?? '',
            data: $data
        );
    }

    public function hasImage(): bool
    {
        return ! empty($this->image);
    }
}
