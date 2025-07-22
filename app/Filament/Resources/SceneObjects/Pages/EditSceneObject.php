<?php

namespace App\Filament\Resources\SceneObjects\Pages;

use App\Filament\Resources\SceneObjects\SceneObjectResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSceneObject extends EditRecord
{
    protected static string $resource = SceneObjectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
