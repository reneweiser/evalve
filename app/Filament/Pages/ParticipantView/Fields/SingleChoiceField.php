<?php

namespace App\Filament\Pages\ParticipantView\Fields;

use App\Models\Question;
use Filament\Forms\Components\Radio;

class SingleChoiceField
{
    public static function make(Question $question): array
    {
        $properties = $question->properties ?? [];
        $options = collect($properties['options'] ?? [])
            ->mapWithKeys(fn (array $option, int $index): array => [
                $index => $option['option'] ?? '',
            ])
            ->toArray();

        return [
            Radio::make('response')
                ->label(__('participant.your_answer'))
                ->options($options)
                ->required(),
        ];
    }
}
