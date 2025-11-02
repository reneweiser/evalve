<?php

namespace App\Filament\Pages\ParticipantView\Services;

use App\Models\Question;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class QuestionLoaderService
{
    public static function load(?string $questionId): ?Question
    {
        if (! $questionId) {
            return null;
        }

        try {
            return Question::findOrFail($questionId);
        } catch (ModelNotFoundException $e) {
            return null;
        }
    }

    public static function loadOrFail(string $questionId): Question
    {
        return Question::findOrFail($questionId);
    }
}
