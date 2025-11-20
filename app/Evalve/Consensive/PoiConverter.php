<?php

namespace App\Evalve\Consensive;

use App\Models\SceneObject;
use Filament\Facades\Filament;
use Illuminate\Support\Facades\Storage;

final class PoiConverter
{
    public static function fromVr4MorePoi(array $data): array
    {
        $poses = [];

        foreach ($data['poses'] as $pose) {
            $poses[] = [
                'data' => [
                    'id' => $pose['id'],
                    'role' => $pose['role'],
                    'position' => $pose['position'],
                    'rotation' => $pose['rotation'],
                    'scale' => $pose['scale'],
                    'referenceCategory' => $pose['referenceCategory'],
                    'overrideBlackWhitelists' => $pose['overrideBlackWhitelists'],
                ],
                'type' => 'pose',
            ];
        }

        return [
            'team_id' => Filament::getTenant()->id,
            'name' => $data['title'],
            'imageUrl' => $data['imageUrl'],
            'transform' => [
                'position' => $data['position'],
                'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
            ],
            'properties' => [
                ...$poses,
                [
                    'type' => 'cgData',
                    'data' => [
                        'id' => $data['id'],
                        'title' => $data['title'],
                        'order' => $data['order'],
                        'dwellTime' => $data['dwellTime'],
                        'passthrough' => $data['passthrough'],
                        'transitions' => $data['transitions'],
                    ]
                ]
            ],
        ];
    }

    public static function toVr4MorePoi(SceneObject $sceneObject): array
    {
        $poses = collect($sceneObject->properties)
            ->where('type', 'pose')
            ->map(fn ($pose) => [
                ...$pose['data'],
                'scale' => 1.0,
                'overrideBlackWhitelists' => false,
            ])
            ->values()
            ->toArray();

        return [
            'order' => 0,
            'title' => $sceneObject->name,
            'poiId' => $sceneObject->name,
            'description' => '',
            'position' => $sceneObject->transform['position'],
            'fixtureReference' => '',
            'dwellTime' => -1.0,
            'imageUrl' => Storage::disk('public')->url($sceneObject->imageUrl),
            'audioUrl' => '',
            'passthrough' => 0,
            'poses' => $poses,
        ];
    }
}
