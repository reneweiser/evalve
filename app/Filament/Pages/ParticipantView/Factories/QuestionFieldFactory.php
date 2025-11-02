<?php

namespace App\Filament\Pages\ParticipantView\Factories;

use App\Filament\Pages\ParticipantView\Fields\ImageField;
use App\Filament\Pages\ParticipantView\Fields\MultipleChoiceField;
use App\Filament\Pages\ParticipantView\Fields\SemanticDifferentialField;
use App\Filament\Pages\ParticipantView\Fields\SingleChoiceField;
use App\Models\Question;
use InvalidArgumentException;

class QuestionFieldFactory
{
    public static function make(?Question $question): array
    {
        if (! $question) {
            return [];
        }

        return match ($question->type) {
            'semantic_differential' => SemanticDifferentialField::make($question),
            'single_choice' => SingleChoiceField::make($question),
            'multiple_choice' => MultipleChoiceField::make($question),
            'image' => ImageField::make($question),
            default => throw new InvalidArgumentException("Unknown question type: {$question->type}")
        };
    }

    public static function getSupportedTypes(): array
    {
        return [
            'semantic_differential',
            'single_choice',
            'multiple_choice',
            'image',
        ];
    }
}
