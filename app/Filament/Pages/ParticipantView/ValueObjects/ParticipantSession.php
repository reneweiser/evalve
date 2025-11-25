<?php

namespace App\Filament\Pages\ParticipantView\ValueObjects;

class ParticipantSession
{
    public function __construct(
        public readonly string $sessionId,
        public readonly string $alias,
        public readonly string $role,
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
        $sessionId = request()->get('sessionName');

        return new self($sessionId, $userAlias, $userRole);
    }

    public static function create(): self
    {
        return new self('default-session', 'default-user', 'Default');
    }
}
