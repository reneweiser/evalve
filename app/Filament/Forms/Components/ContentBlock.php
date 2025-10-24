<?php

namespace App\Filament\Forms\Components;

use Filament\Forms\Components\Field;

class ContentBlock extends Field
{
    protected string $view = 'filament.forms.components.content-block';

    protected string | null $content = '';

    public function content(string $question): static
    {
        $this->content = $question;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->evaluate($this->content);
    }
}
