<?php

namespace App\Filament\Pages\ParticipantView\ValueObjects;

use Illuminate\Support\Str;

class ParticipantSession
{
    public function __construct(
        public readonly string $sessionId,
        public readonly ?string $role = null,
    ) {}

    /**
     * Create a ParticipantSession from the current request.
     *
     * For VR clients: Uses userAlias and userRole query parameters if provided.
     * For web users: Falls back to session-based identification.
     */
    public static function fromRequest(): self
    {
        $userAlias = request()->get('userAlias');
        $userRole = request()->get('userRole');

        // VR client provided identity via query parameters
        if ($userAlias) {
            return new self($userAlias, $userRole);
        }

        // Fall back to session-based identity for web users
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
