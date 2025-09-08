<?php

namespace App\Livewire;

use Filament\Actions\Action;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Widgets\Widget;
use Illuminate\Support\Facades\Storage;

class ClientDownloads extends Widget implements HasActions, HasSchemas
{
    use InteractsWithActions;
    use InteractsWithSchemas;

    protected string $view = 'livewire.client-downloads';
    public string $link = "";

    public function mount(): void
    {
        $this->link = Storage::url('public/clients/latest.zip');
    }

    public function updateClientAction(): Action
    {
        return Action::make('updateClient')
            ->color('primary')
            ->schema([
                FileUpload::make('file')
                    ->disk('public')
                    ->directory('clients')
                    ->getUploadedFileNameForStorageUsing(fn ($file) => 'latest.zip')
            ])
            ->action(function ($data) {
                Notification::make()
                    ->title('Client app updated')
                    ->success()
                    ->send();
            });
    }
}
