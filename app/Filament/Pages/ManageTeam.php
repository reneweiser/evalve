<?php

namespace App\Filament\Pages;

use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Tenancy\EditTenantProfile;
use Filament\Schemas\Schema;

class ManageTeam extends EditTenantProfile
{
    protected string $view = 'filament.pages.manage-team';

    public static function getLabel(): string
    {
        return 'Manage Team';
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Textinput::make('name')
        ]);
    }

    public function submit(): void
    {
        $this->tenant->update([
            'name' =>$this->data['name'],
        ]);

        Notification::make()
            ->title('Team Updated')
            ->success()
            ->send();
    }
}
