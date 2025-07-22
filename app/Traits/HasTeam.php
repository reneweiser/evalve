<?php

namespace App\Traits;

use App\Models\Team;

trait HasTeam
{
    public function team(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
