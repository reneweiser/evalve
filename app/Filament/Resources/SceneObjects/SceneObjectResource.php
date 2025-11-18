<?php

namespace App\Filament\Resources\SceneObjects;

use App\Filament\Resources\SceneObjects\Pages\CreateSceneObject;
use App\Filament\Resources\SceneObjects\Pages\EditSceneObject;
use App\Filament\Resources\SceneObjects\Pages\ListSceneObjects;
use App\Filament\Resources\SceneObjects\Schemas\SceneObjectForm;
use App\Filament\Resources\SceneObjects\Tables\SceneObjectsTable;
use App\Models\SceneObject;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class SceneObjectResource extends Resource
{
    protected static ?string $model = SceneObject::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|UnitEnum|null $navigationGroup = 'Elements';

    public static function form(Schema $schema): Schema
    {
        return SceneObjectForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SceneObjectsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSceneObjects::route('/'),
            'create' => CreateSceneObject::route('/create'),
            'edit' => EditSceneObject::route('/{record}/edit'),
        ];
    }
}
