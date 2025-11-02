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
use Filament\Schemas\Schema;
use Illuminate\Contracts\Support\Htmlable;

class ParticipantView extends SimplePage implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.participant-view';

    public ?string $questionId = null;

    public ?Question $question = null;

    protected ?ParticipantSession $session = null;

    public function mount(): void
    {
        $this->questionId = request()->get('questionId');
        $this->question = QuestionLoaderService::load($this->questionId);
        $this->session = ParticipantSession::fromRequest();

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
        return $this->question?->text ?? __('participant.question_not_found');
    }

    protected function getSession(): ParticipantSession
    {
        if (! $this->session) {
            $this->session = ParticipantSession::fromRequest();
        }

        return $this->session;
    }

    public function form(Schema $schema): Schema
    {
        return $schema->schema(
            QuestionFieldFactory::make($this->question)
        );
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
}
