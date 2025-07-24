<?php

namespace App\Models;

use App\Traits\HasTeam;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class SceneObject extends Model
{
    use HasUlids, HasTeam;

    protected $casts = [
        'transform' => 'array',
        'properties' => 'array',
    ];
}
