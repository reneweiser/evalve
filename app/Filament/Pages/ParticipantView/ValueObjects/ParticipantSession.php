<?php

namespace App\Filament\Pages\ParticipantView\ValueObjects;

use Illuminate\Support\Str;

class ParticipantSession
{
    public function __construct(
        public readonly string $sessionId
    ) {}

    public static function fromRequest(): self
    {
        $sessionId = session()->get('participant_session_id');

        if (! $sessionId) {
            $sessionId = Str::ulid()->toString();
            session()->put('participant_session_id', $sessionId);
        }

        return new self($sessionId);
    }

    public static function create(): self
    {
        $sessionId = Str::ulid()->toString();
        session()->put('participant_session_id', $sessionId);

        return new self($sessionId);
    }
}
