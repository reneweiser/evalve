<?php

namespace App\Livewire;

use Filament\Widgets\Widget;
use Illuminate\Support\Facades\Storage;

class ClientDownloads extends Widget
{
    protected string $view = 'livewire.client-downloads';
    public string $link = "";

    public function mount(): void
    {
        $this->link = Storage::url('public/clients/latest.zip');
    }
}
