<?php

namespace App\Filament\Pages;

use App\Filament\Pages\ModeratorView\Schemas\ModelsTabSchema;
use App\Filament\Pages\ModeratorView\Schemas\PoisTabSchema;
use App\Filament\Pages\ModeratorView\Schemas\SettingsTabSchema;
use App\Filament\Pages\ModeratorView\Services\ModelGroupService;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\SimplePage;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;
use Filament\Support\Enums\Width;
use Illuminate\Contracts\Support\Htmlable;

class ModeratorView extends SimplePage implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.moderator-view';

    protected Width|string|null $maxContentWidth = Width::ScreenExtraLarge;

    public array $data = [
        'models' => [],
        'notes' => [],
    ];

    public array $modelGroups;

    public string $name;

    public string $team;

    private ModelGroupService $modelGroupService;

    public function mount(): void
    {
        $this->name = request()->get('name');
        $this->team = request()->get('team');
        $this->modelGroupService = new ModelGroupService;
        $this->modelGroups = $this->modelGroupService->getCachedModelGroups($this->team);
    }

    public function hasLogo(): bool
    {
        return false;
    }

    public function getHeading(): string|Htmlable
    {
        return $this->name;
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Tabs::make('Moderator Panel')
                    ->contained(false)
                    ->statePath('data')
                    ->tabs([
                        PoisTabSchema::make($this->team),
                        ModelsTabSchema::make($this->modelGroups),
                        SettingsTabSchema::make(),
                    ]),
            ]);
    }
}
