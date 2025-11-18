<?php

namespace App\Evalve\Consensive;

use App\Models\SceneObject;
use Illuminate\Support\Facades\Storage;

final class PoiConverter
{
    public static function convert(SceneObject $sceneObject): array
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
