<?php

namespace App\Filament\Pages\ParticipantView\Fields;

use App\Models\Question;
use Filament\Forms\Components\CheckboxList;

class MultipleChoiceField
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
            CheckboxList::make('response')
                ->label(__('participant.select_all_that_apply'))
                ->options($options)
                ->required(),
        ];
    }
}
