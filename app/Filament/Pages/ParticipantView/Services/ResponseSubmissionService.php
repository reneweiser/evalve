<?php

namespace App\Filament\Pages\ParticipantView\Services;

use App\Filament\Pages\ParticipantView\ValueObjects\ParticipantSession;
use App\Filament\Pages\ParticipantView\ValueObjects\ResponseData;
use App\Models\QuestionResponse;

class ResponseSubmissionService
{
    public static function store(ResponseData $responseData, ParticipantSession $session): QuestionResponse
    {
        return QuestionResponse::create([
            'question_id' => $responseData->questionId,
            'session_id' => $session->sessionId,
            'alias' => $session->alias,
            'role' => $session->role,
            'response_data' => $responseData->data,
            'submitted_at' => now(),
        ]);
    }

    public static function hasResponded(string $questionId, ParticipantSession $session): bool
    {
        return QuestionResponse::where('question_id', $questionId)
            ->where('session_id', $session->sessionId)
            ->where('alias', $session->alias)
            ->exists();
    }
}
