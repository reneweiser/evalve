<?php

namespace App\Filament\Resources\SceneObjects\Pages;

use App\Filament\Resources\SceneObjects\SceneObjectResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSceneObjects extends ListRecords
{
    protected static string $resource = SceneObjectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
