<?php

namespace App\Evalve\FormComponents;

use App\Models\Question;

class Questions
{
    public static function make(): array
    {
        return [
            \Filament\Forms\Components\Select::make('questionIds')
                ->multiple()
                ->options(Question::pluck('text', 'id'))
        ];
    }
}
