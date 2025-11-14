<?php

namespace App\Evalve;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class SceneObjectSettings
{
    public static function set($data): void
    {
        Storage::disk('local')->put('soSettings.json', json_encode($data));
        Cache::forget('soSettings');
    }

    public static function get(): array
    {
        return Cache::remember('soSettings', 3600, function () {
            return Storage::disk('local')->json('soSettings.json') ?? [
                'width' => 160,
                'height' => 60,
                'zoom' => 1,
                'modelGroups' => []
            ];
        });
    }

    public static function asCollection(string $key): \Illuminate\Support\Collection
    {
        return collect(SceneObjectSettings::get()[$key]);
    }

    public static function asString(array $activeModels): string
    {
        return collect(self::get()['modelGroups'])
            ->map(function (array $model) use ($activeModels): string {
                $model = $model['name'];
                return in_array($model, $activeModels) ? "+$model" : "-$model";
            })
            ->join(',');
    }
}
