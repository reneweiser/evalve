<?php

namespace App\Models;

use App\Traits\HasTeam;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class SceneObject extends Model
{
    use HasTeam, HasUlids;

    protected $fillable = [
        'name',
        'imageUrl',
        'transform',
        'properties',
        'team_id',
    ];

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

    public function getPropertiesInOrder(PropertyType ...$types): Collection
    {
        $typeNames = collect($types)->map(fn ($type) => $type->name)->all();

        return collect($this->properties ?? [])
            ->filter(fn (array $property): bool => in_array($property['type'] ?? null, $typeNames));
    }

    public static function updateOrCreateWithPropertyMerge(array $attributes, array $values): self
    {
        $sceneObject = static::firstOrNew($attributes);
        $oldProperties = $sceneObject->properties ?? [];

        $sceneObject->fill($values);

        // Now merge properties with old data
        $newProperties = $values['properties'] ?? [];
        $sceneObject->properties = static::mergeProperties($oldProperties, $newProperties);

        $sceneObject->save();

        return $sceneObject;
    }

    private static function mergeProperties(array $old, array $new): array
    {
        $old = collect($old)
            ->reject(fn (array $property) => in_array($property['type'], ['cgData', 'pose']))
            ->values()
            ->toArray();

        return array_merge($old, $new);
    }
}

enum PropertyType
{
    case models;
    case question;
    case notes;
    case pollingField;
}
