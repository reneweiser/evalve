<?php

namespace App\Evalve\FormComponents;

use Filament\Schemas\Components\Section;
use Illuminate\Support\Facades\Storage;

class Question
{
    public static function make(): array
    {
        return [
            \Filament\Forms\Components\Select::make('questionId')
                ->label('Question')
                ->options(\App\Models\Question::pluck('text', 'id')),
            \Filament\Forms\Components\Select::make('models')
                ->multiple()
                ->options(function () {
                    return collect(Storage::disk('local')->json('soSettings.json')['modelGroups'])
                        ->mapWithKeys(fn ($group) => [$group['name'] => $group['name']])
                        ->toArray();
                }),
            Section::make('Result Billboard')
                ->contained(false)
                ->description('Contains results for this question.')
                ->schema(Billboard::make()),
        ];
    }
}
