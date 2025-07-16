<?php

namespace App\Filament\Pages\Tenancy;

use App\Models\Team;
use Filament\Forms\Components\TextInput;
use Filament\Pages\Tenancy\RegisterTenant;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Model;

class RegisterTeam extends RegisterTenant
{
    protected string $view = 'filament.pages.register-team';

    public static function getLabel(): string
    {
        return 'Register a new team';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
            ]);
    }

    protected function handleRegistration(array $data): Model
    {
        $team = Team::create($data);

        $team->members()->attach(auth()->user());

        return $team;
    }
}
