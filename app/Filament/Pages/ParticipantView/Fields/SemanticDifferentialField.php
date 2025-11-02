<?php

namespace App\Filament\Pages\ParticipantView\Fields;

use App\Models\Question;
use Filament\Forms\Components\Radio;
use Filament\Schemas\Components\Section;

class SemanticDifferentialField
{
    public static function make(Question $question): array
    {
        $properties = $question->properties ?? [];
        $size = $properties['size'] ?? 5;
        $items = $properties['items'] ?? [];

        $fields = [];

        foreach ($items as $index => $item) {
            $labelA = $item['label_a'] ?? '';
            $labelB = $item['label_b'] ?? '';

            $options = [];
            for ($i = 1; $i <= $size; $i++) {
                $options[$i] = (string) $i;
            }

            $fields[] = Section::make()
                ->contained(false)
                ->schema([
                    Radio::make("item_{$index}")
                        ->label("{$labelA} ↔ {$labelB}")
                        ->options($options)
                        ->inline()
                        ->required(),
                ]);
        }

        return $fields;
    }
}
