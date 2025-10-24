<?php

namespace App\Models;

use App\Traits\HasTeam;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class SceneObject extends Model
{
    use HasUlids, HasTeam;

    protected $casts = [
        'transform' => 'array',
        'properties' => 'array',
    ];

    public function getProperties(PropertyType $type): Collection
    {
        return collect($this->properties)
            ->filter(fn (array $property): bool => $property['type'] === $type->name)
            ->map(fn (array $property): array => collect($property['data'])->toArray())
            ->values();
    }

    public function getProperty(PropertyType $type)
    {
        $toArray = $this->getProperties($type)->toArray();
        return empty($toArray) ? null : $toArray[0];
    }
}

enum PropertyType
{
    case models;
    case question;
    case notes;
    case pollingField;
}
