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

class QuestionSection
{
    public static function make(array $questionDataArray, array $questions): Section
    {
        $questionData = QuestionData::fromArray($questionDataArray);

        return Section::make(__('moderator.individual_voting'))
            ->key($questionData->questionId)
            ->icon(Heroicon::User)
            ->headerActions([
                self::buildShowModelsAction($questionData),
            ])
            ->footer([
                self::buildOpenAction($questionData),
                self::buildCloseAction($questionData),
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

    private static function buildOpenAction(QuestionData $questionData): Action
    {
        return Action::make('openQuestion')
            ->label(__('moderator.open'))
            ->action(function ($component) use ($questionData) {
                $participantUrl = route('public.participant', ['questionId' => $questionData->questionId]);
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
}
