<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'name',
    ];

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function sceneObjects(): HasMany
    {
        return $this->hasMany(SceneObject::class);
    }

    public function assetBundles(): HasMany
    {
        return $this->hasMany(Asset::class);
    }
}
