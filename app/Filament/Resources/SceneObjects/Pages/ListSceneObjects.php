<?php

namespace App\Filament\Resources\SceneObjects\Pages;

use App\Evalve\Consensive\PoiConverter;
use App\Evalve\SceneObjectSettings;
use App\Filament\Resources\SceneObjects\SceneObjectResource;
use App\Models\SceneObject;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Facades\Filament;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ListSceneObjects extends ListRecords
{
    protected static string $resource = SceneObjectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
            Action::make('settings')
                ->fillForm(fn(): array => SceneObjectSettings::get())
                ->schema([
                    Repeater::make('modelGroups')
                        ->schema([
                            TextInput::make('name')
                        ])
                ])
                ->action(function (array $data) {
                    SceneObjectSettings::set($data);
                }),
            Action::make('Push to Consensive')
                ->schema([
                    Select::make('pois')
                        ->label('Select Pois to push')
                        ->multiple()
                        ->options(Filament::getTenant()->sceneObjects()->pluck('name', 'id'))
                ])
                ->action(function (array $data) {
                    $pois = SceneObject::query()
                        ->whereIn('id', $data['pois'])
                        ->get()
                        ->map(fn ($poi) => PoiConverter::convert($poi))
                        ->toArray();
                    $body = json_encode(['pois' => $pois]);

                    $user = config('services.vr4more.user');
                    $password = config('services.vr4more.password');
                    $sceneId = config('services.vr4more.scene_id');

                    $accessToken = Http::withBasicAuth($user, $password)
                        ->post('https://db2.vr4more.com/login/')
                        ->json('accessToken');

                    $response = Http::withHeaders([
                        'Authorization' => "Token $accessToken",
                        'Content-Type' => 'application/json',
                    ])
                        ->withBody($body)
                        ->post("https://db2.vr4more.com/scenes/$sceneId/pois/reset/");

                    if (!$response->successful()) {
                        Notification::make()
                            ->title('Request failed. VR4More responded: ' . $response->reason())
                            ->danger()
                            ->send();
                        return;
                    }

                    collect($response->json('pois'))
                        ->each(function ($poi) {
                            $sceneObject = SceneObject::query()
                                ->where('name', $poi['title'])
                                ->first();

                            $properties = collect($sceneObject->properties)
                                ->reject(fn ($value) => $value['type'] === 'cgData')
                                ->push([
                                    'data' => [
                                        'id' => $poi['id'],
                                        'order' => $poi['order'],
                                        'fixtureReference' => $poi['fixtureReference'],
                                        'dwellTime' => $poi['dwellTime'],
                                        'passthrough' => $poi['passthrough'],
                                    ],
                                    'type' => 'cgData',
                                ])
                                ->toArray();

                            $sceneObject->update([
                                'properties' => $properties,
                            ]);
                        });

                    Notification::make()
                        ->title('Data pushed to Commonground. VR4More responded: ' . $response->reason())
                        ->success()
                        ->send();
                }),
            Action::make('Import Pois')
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
