<?php

namespace App\Filament\Forms\Components;

use Filament\Forms\Components\Field;

class PublishQuestion extends Field
{
    protected string $view = 'filament.forms.components.publish-question';

    protected string | null $question = null;

    public function question(string $question): static
    {
        $this->question = $question;

        return $this;
    }

    public function getQuestion(): ?string
    {
        return $this->evaluate($this->question);
    }
}
