<?php

namespace App\Filament\Pages;

use App\Filament\Pages\ParticipantView\Factories\QuestionFieldFactory;
use App\Filament\Pages\ParticipantView\Services\QuestionLoaderService;
use App\Filament\Pages\ParticipantView\Services\ResponseSubmissionService;
use App\Filament\Pages\ParticipantView\ValueObjects\ParticipantSession;
use App\Filament\Pages\ParticipantView\ValueObjects\ResponseData;
use App\Models\Question;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\SimplePage;
use Filament\Schemas\Components\Text;
use Filament\Schemas\Schema;
use Filament\Support\Enums\TextSize;
use Filament\Support\Enums\Width;
use Illuminate\Contracts\Support\Htmlable;

class ParticipantView extends SimplePage implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.participant-view';

    protected Width|string|null $maxWidth = Width::ScreenLarge;

    public ?string $questionId = null;

    public ?Question $question = null;

    public ?string $userAlias = null;

    public ?string $userRole = null;

    protected ?ParticipantSession $session = null;

    public ?array $data = null;

    public function mount(): void
    {
        $this->questionId = request()->get('questionId');
        $this->userAlias = request()->get('userAlias');
        $this->userRole = request()->get('userRole');
        $this->question = QuestionLoaderService::load($this->questionId);
        $this->session = ParticipantSession::fromRequest();
        $this->form->fill();

        if ($this->question && ResponseSubmissionService::hasResponded($this->question->id, $this->getSession())) {
            Notification::make()
                ->warning()
                ->title(__('participant.already_responded'))
                ->persistent()
                ->send();
        }
    }

    public function getTitle(): string|Htmlable
    {
        return '';
    }

    protected function getSession(): ParticipantSession
    {
        if (! $this->session) {
            // Use persisted Livewire properties if available (from VR clients)
            if ($this->userAlias) {
                $this->session = new ParticipantSession($this->userAlias, $this->userRole);
            } else {
                // Fall back to session-based identity for web users
                $this->session = ParticipantSession::fromRequest();
            }
        }

        return $this->session;
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components(
            [
                Text::make($this->question?->text ?? __('participant.question_not_found'))
                    ->size(TextSize::Large),
                ...QuestionFieldFactory::make($this->question),
            ]
        )->statePath('data');
    }

    public function submit(): void
    {
        if (! $this->question) {
            Notification::make()
                ->danger()
                ->title(__('participant.question_not_found'))
                ->send();

            return;
        }

        // Image questions don't require submission
        if ($this->question->type === 'image') {
            return;
        }

        if (ResponseSubmissionService::hasResponded($this->question->id, $this->getSession())) {
            Notification::make()
                ->warning()
                ->title(__('participant.already_responded'))
                ->send();

            return;
        }

        try {
            $formData = $this->form->getState();
            $responseData = ResponseData::fromFormData($this->question, $formData);

            ResponseSubmissionService::store($responseData, $this->getSession());

            Notification::make()
                ->success()
                ->title(__('participant.response_submitted'))
                ->body(__('participant.thank_you'))
                ->send();

            $this->form->fill([]);
        } catch (\Exception $e) {
            Notification::make()
                ->danger()
                ->title(__('participant.response_submission_failed'))
                ->body($e->getMessage())
                ->send();
        }
    }

    public function hasLogo(): bool
    {
        return false;
    }

    public function hasTopbar(): bool
    {
        return false;
    }
}
