<?php

namespace App\Filament\Pages\ParticipantView\ValueObjects;

use App\Models\Question;

class ResponseData
{
    public function __construct(
        public readonly string $questionId,
        public readonly string $questionType,
        public readonly array $data
    ) {}

    public static function fromFormData(Question $question, array $formData): self
    {
        return new self(
            questionId: $question->id,
            questionType: $question->type,
            data: $formData
        );
    }

    public function toArray(): array
    {
        return [
            'question_id' => $this->questionId,
            'question_type' => $this->questionType,
            'response_data' => $this->data,
        ];
    }
}
