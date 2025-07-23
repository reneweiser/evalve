<?php

namespace App\Evalve\FormComponents;

use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\Toggle;

class Text
{
    public static function make()
    {
        return [
            MarkdownEditor::make('content')
                ->toolbarButtons([
                    ['heading'],
                    ['bold', 'italic', 'strike'],
                ]),
            Toggle::make('is_required'),
        ];
    }
}
