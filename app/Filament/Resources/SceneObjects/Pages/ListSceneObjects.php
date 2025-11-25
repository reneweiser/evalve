<?php

namespace App\Filament\Resources\SceneObjects\Pages;

use App\Evalve\Consensive\PoiConverter;
use App\Evalve\Consensive\Vr4MorePoiService;
use App\Evalve\SceneObjectSettings;
use App\Filament\Resources\SceneObjects\SceneObjectResource;
use App\Models\SceneObject;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\CreateAction;
use Filament\Facades\Filament;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\FusedGroup;
use Filament\Schemas\Components\Section;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
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
                ->fillForm(fn (): array => SceneObjectSettings::get())
                ->schema([
                    Section::make('Avatar Webview')
                        ->schema([
                            FusedGroup::make([
                                TextInput::make('width')
                                    ->prefix('Width')
                                    ->numeric(),
                                TextInput::make('height')
                                    ->prefix('Height')
                                    ->numeric(),
                                TextInput::make('zoom')
                                    ->prefix('Zoom')
                                    ->numeric(),
                            ])->columns(3),
                        ]),
                    Repeater::make('modelGroups')
                        ->schema([
                            TextInput::make('name'),
                        ]),
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
                        ->hintAction(fn (Select $component) => Action::make('select_all')
                            ->label('Select All')
                            ->action(fn () => $component->state(Filament::getTenant()->sceneObjects()->pluck('id')))
                        ),
                ])
                ->action(function (array $data) {
                    $pois = SceneObject::query()
                        ->whereIn('id', $data['pois'])
                        ->get()
                        ->map(fn ($poi) => PoiConverter::toVr4MorePoi($poi))
                        ->toArray();
                    $body = json_encode(['pois' => $pois]);

                    $sceneId = config('services.vr4more.scene_id');

                    $accessToken = Cache::remember('vr4more_auth_token', 3600 * 6, function () {
                        $user = config('services.vr4more.user');
                        $password = config('services.vr4more.password');

                        return Http::withBasicAuth($user, $password)
                            ->post(config('services.vr4more.url').'/login/')
                            ->json('accessToken');
                    });

                    $response = Http::withBody($body)
                        ->withHeaders(['Authorization' => "Token $accessToken"])
                        ->post(config('services.vr4more.url')."/scenes/$sceneId/pois/reset/");

                    if (! $response->successful()) {
                        Notification::make()
                            ->title('Request failed. VR4More responded: '.$response->reason())
                            ->danger()
                            ->send();

                        return;
                    }

                    Notification::make()
                        ->title('Data pushed to Commonground. VR4More responded: '.$response->reason())
                        ->success()
                        ->send();
                }),
            ActionGroup::make([
                Action::make('fromApi')
                    ->label('From API')
                    ->disabled()
                    ->tooltip('Disabled: More testing needed')
                    ->action(function (Vr4MorePoiService $service) {
                        $pois = collect($service->getPois()['pois'])
                            ->map(fn ($poi) => PoiConverter::fromVr4MorePoi($poi));

                        foreach ($pois as $poi) {
                            SceneObject::updateOrCreateWithPropertyMerge(
                                ['name' => $poi['name']],
                                $poi
                            );
                        }
                    }),
                Action::make('fromFile')
                    ->label('From File')
                    ->disabled()
                    ->tooltip('Disabled: More testing needed')
                    ->schema([
                        FileUpload::make('json_file')
                            ->disk('local'),
                    ])
                    ->action(function (array $data): void {
                        $pois = collect(Storage::disk('local')->json($data['json_file'])['pois'])
                            ->map(fn ($poi) => PoiConverter::fromVr4MorePoi($poi));

                        foreach ($pois as $poi) {
                            SceneObject::updateOrCreateWithPropertyMerge(
                                ['name' => $poi['name']],
                                $poi
                            );
                        }
                    }),
            ])
                ->button()

                ->label('Import POIs'),
        ];
    }
}
