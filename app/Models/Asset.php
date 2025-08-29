<?php

namespace App\Models;

use App\Traits\HasTeam;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Yaml\Yaml;

class Asset extends Model
{
    use HasUlids, HasTeam;

    protected $casts = [
        'properties' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        parent::creating(function (Asset $asset) {
            $manifestRaw = Storage::disk('local')->get($asset->properties['manifest']);
            $manifest = Yaml::parse($manifestRaw);
            $assets = collect($manifest['Assets'])->map(function ($item) {
                return ['name' => $item];
            });

            $asset->properties = [
                ...$asset->properties,
                'assets' => $assets,
                'unity_version' => $manifest['UnityVersion'],
                'crc' => $manifest['CRC'],
            ];
        });

        parent::deleting(function (Asset $asset) {
            if ($asset->type === 'unity_asset_bundle') {
                Storage::delete($asset->properties['bundle']);
                Storage::delete($asset->properties['manifest']);
            }

            if ($asset->type === 'gltf_glb') {
                Storage::delete($asset->properties['glb']);
            }
        });
    }
}
