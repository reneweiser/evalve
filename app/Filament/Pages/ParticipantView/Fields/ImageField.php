<?php

namespace App\Filament\Pages\ParticipantView\Fields;

use App\Models\Question;
use Filament\Forms\Components\ViewField;
use Illuminate\Support\Facades\Storage;

class ImageField
{
    public static function make(Question $question): array
    {
        $properties = $question->properties ?? [];
        $imagePath = $properties['image_path'] ?? null;

        if (! $imagePath) {
            return [];
        }

        $imageUrl = Storage::disk('public')->url($imagePath);

        return [
            ViewField::make('image')
                ->view('filament.forms.components.question-image', [
                    'imageUrl' => $imageUrl,
                ]),
        ];
    }
}
