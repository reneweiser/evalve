<?php

namespace App\Models;

use App\Traits\HasTeam;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasUlids, HasTeam;

    protected $casts = [
        'fields' => 'array',
    ];
}
