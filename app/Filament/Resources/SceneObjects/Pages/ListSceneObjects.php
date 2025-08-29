<?php

namespace App\Filament\Resources\SceneObjects\Pages;

use App\Filament\Resources\SceneObjects\SceneObjectResource;
use App\Models\SceneObject;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Facades\Filament;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Facades\Storage;

class ListSceneObjects extends ListRecords
{
    protected static string $resource = SceneObjectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
            Action::make('Import POIs')
                ->schema([
                    FileUpload::make('json_file')
                        ->disk('local'),
                ])
                ->action(function (array $data): void {
                    $pois = collect(Storage::disk('local')->json($data['json_file'])['pois']);
                    $poisFormatted = $pois->map(fn ($poi) => [
                        'name' => $poi['title'],
                        'team_id' => Filament::getTenant()->id,
                        'transform' => [
                            'position' => $poi['position'],
                            'rotation' => [ 'x' => 0.0, 'y' => 0.0, 'z' => 0.0, ],
                        ],
                        'properties' => self::makeProperties($poi),
                    ]);

                    foreach ($poisFormatted as $poi) {
                        SceneObject::updateOrCreate(
                            ['name' => $poi['name']],
                            $poi
                        );
                    }
                })
        ];
    }

    private static function makeProperties($poi)
    {
        $poses = [];

        foreach ($poi['poses'] as $pose) {
            $poses[] = [
                'data' => [
                    'id' => $pose['id'],
                    'role' => $pose['role'],
                    'position' => $pose['position'],
                    'rotation' => $pose['rotation'],
                ],
                'type' => 'pose',
            ];
        }

        return $poses;
    }
}
