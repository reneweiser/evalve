<?php

namespace App\Filament\Forms\Components;

use Filament\Forms\Components\Field;

class ContentBlock extends Field
{
    protected string $view = 'filament.forms.components.content-block';

    public function getContent(): string
    {
        return 'Lorem Ipsum is simply dummy text of the printing.';
    }
}
