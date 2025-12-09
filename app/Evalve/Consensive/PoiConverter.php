<?php

namespace App\Evalve\Consensive;

use App\Evalve\SceneObjectSettings;
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
            'imageUrl' => $data['imageUrl'] ?? 'https://placehold.co/150x150?text=Thumbnail+missing',
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
                        'blacklist' => $data['blacklist'] ?? [],
                        'passthrough' => $data['passthrough'],
                        'transitions' => $data['transitions'],
                    ]
                ]
            ],
        ];
    }

    public static function toVr4MorePoi(SceneObject $sceneObject): array
    {
        $properties = collect($sceneObject->properties);
        $cgData = $properties->firstWhere('type', 'cgData') ?? ['data' => []];

        $cgData = $cgData['data'];
        $poses = collect($sceneObject->properties)
            ->where('type', 'pose')
            ->map(function ($pose) {
                $pose = $pose['data'];
                return [
                    'role' => $pose['role'],
                    'position' => $pose['position'],
                    'rotation' => $pose['rotation'],
                    'scale' => $pose['scale'] ?? 1,
                    'referenceCategory' => $pose['referenceCategory'] ?? 'default',
                    'overrideBlackWhitelists' => $pose['overrideBlackWhitelists'] ?? false,
                ];
            })
            ->values()
            ->toArray();

        $imageUrl = 'https://placehold.co/150x150?text=Thumbnail+missing';

        if (str_starts_with($sceneObject->imageUrl, 'https://data.vr4more.com')) {
            $imageUrl = $sceneObject->imageUrl;
        }
        if (str_starts_with($sceneObject->imageUrl, 'https://projects.vreval.de')) {
            $imageUrl = $sceneObject->imageUrl;
        }
        if (str_starts_with($sceneObject->imageUrl, 'thumnails')) {
            $imageUrl = asset(Storage::url($sceneObject->imageUrl));
        }

        return [
            'order' => $cgData['order'] ?? 0,
            'title' => $sceneObject->name,
            'poiId' => $sceneObject->name,
            'description' => '',
            'position' => $sceneObject->transform['position'],
            'dwellTime' => $cgData['dwellTime'] ?? -1,
            'blacklist' => array_values($cgData['blacklists'] ?? []) ?? [],
            'imageUrl' => $imageUrl,
            'passthrough' => $cgData['passthrough'] ?? 1,
            'poses' => $poses,
            'transitions' => $cgData['transitions'] ?? [],
        ];
    }
}
