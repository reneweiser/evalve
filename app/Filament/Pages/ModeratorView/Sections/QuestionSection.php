<?php

namespace App\Filament\Pages\ModeratorView\Sections;

use App\Filament\Pages\ModeratorView\Services\SceneObjectDispatcher;
use App\Filament\Pages\ModeratorView\ValueObjects\ModelVisibilityData;
use App\Filament\Pages\ModeratorView\ValueObjects\QuestionData;
use Filament\Actions\Action;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Text;
use Filament\Support\Enums\Size;
use Filament\Support\Enums\TextSize;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Str;

class QuestionSection
{
    public static function make(array $questionDataArray, array $questions, string $sessionName): Section
    {
        $questionData = QuestionData::fromArray($questionDataArray);

        return Section::make(__('moderator.individual_voting'))
            ->key($questionData->questionId)
            ->icon(Heroicon::User)
            ->headerActions([
                self::buildShowModelsAction($questionData),
            ])
            ->footer([
                self::buildOpenAction($questionData, $sessionName),
                self::buildCloseAction($questionData),
                self::buildShowResultsAction($questionData, $sessionName),
                self::buildHideResultsAction($questionData),
            ])
            ->schema([
                Text::make($questions[$questionData->questionId] ?? '')
                    ->size(TextSize::Large),
            ]);
    }

    private static function buildShowModelsAction(QuestionData $questionData): Action
    {
        return Action::make('showModels')
            ->label(__('moderator.show_models'))
            ->visible(fn (): bool => $questionData->hasModels())
            ->outlined()
            ->size(Size::Medium)
            ->icon(Heroicon::BuildingOffice2)
            ->action(function (Section $component) use ($questionData) {
                $visibility = ModelVisibilityData::fromModels($questionData->models);
                $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                $dispatcher->dispatchModelSelected($visibility->asString());
            });
    }

    private static function buildOpenAction(QuestionData $questionData, string $sessionName): Action
    {
        return Action::make('openQuestion')
            ->label(__('moderator.open'))
            ->action(function ($component) use ($questionData, $sessionName) {
                $participantUrl = self::buildParticipantUrl($questionData->questionId, $sessionName);
                $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                $dispatcher->dispatchOpenQuestion($questionData, $participantUrl);
            });
    }

    private static function buildCloseAction(QuestionData $questionData): Action
    {
        return Action::make('closeQuestion')
            ->label(__('moderator.close'))
            ->action(function ($component) use ($questionData) {
                $participantUrl = route('public.participant', ['questionId' => $questionData->questionId]);
                $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                $dispatcher->dispatchCloseWebview($questionData, $participantUrl);
            });
    }

    private static function buildShowResultsAction(QuestionData $questionData, string $sessionName): Action
    {
        return Action::make('showResults')
            ->label(__('moderator.show_results'))
            ->color('success')
            ->icon(Heroicon::ChartBar)
            ->action(function ($component) use ($questionData, $sessionName) {
                $billboardUrl = route('public.billboard', [
                    'questionId' => $questionData->questionId,
                    'sessionName' => $sessionName,
                ]);
                $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                $dispatcher->dispatchShowBillboard($questionData, $billboardUrl);
            });
    }

    private static function buildHideResultsAction(QuestionData $questionData): Action
    {
        return Action::make('hideResults')
            ->label(__('moderator.hide_results'))
            ->color('danger')
            ->icon(Heroicon::EyeSlash)
            ->action(function ($component) {
                $dispatcher = new SceneObjectDispatcher($component->getLivewire());
                $dispatcher->dispatchHideBillboard();
            });
    }

    /**
     * Build participant URL with VR client placeholders.
     *
     * The $USERNAME$ and $ROLE$ placeholders are substituted by the VR client
     * with actual user values before the webview is displayed in the scene.
     */
    private static function buildParticipantUrl(string $questionId, string $sessionName): string
    {
        return Str::of(route('public.participant', [
            'questionId' => $questionId,
            'sessionName' => $sessionName,
            'userAlias' => '$USERNAME$',
            'userRole' => '$ROLE$',
        ]))->replace('%24', '$')->value();
    }
}
