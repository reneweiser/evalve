<?php

namespace App\Livewire;

use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Schemas\Schema;
use Filament\Widgets\Widget;
use Illuminate\Support\Facades\Storage;

class ClientDownloads extends Widget implements HasActions, HasSchemas
{
    use InteractsWithActions;
    use InteractsWithSchemas;

    protected string $view = 'livewire.client-downloads';

    public function content(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Client App')->schema([
                ActionGroup::make([
                    Action::make('download')
                        ->url(Storage::url('public/clients/latest.zip')),
                    Action::make('update')
                        ->schema([
                            FileUpload::make('file')
                                ->disk('public')
                                ->directory('clients')
                                ->getUploadedFileNameForStorageUsing(fn ($file) => 'latest.zip')
                        ])
                        ->action(function () {
                            Notification::make()
                                ->title('Client app updated')
                                ->success()
                                ->send();
                        }),
                ])
                    ->buttonGroup()
            ]),
            Section::make('Panels')->schema([
                ActionGroup::make([
                    Action::make('exampleSession')
                        ->url(route('public.moderator', ['name' => 'example-session']), true),
                    Action::make('participant'),
                ])
                    ->buttonGroup()
            ]),
        ]);
    }
}
