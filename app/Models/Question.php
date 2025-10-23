<?php

namespace App\Models;

use App\Traits\HasTeam;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasTeam, HasUlids;

    protected $casts = ['properties' => 'array'];
}
