<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionResponse extends Model
{
    use HasUlids;

    protected $fillable = [
        'question_id',
        'session_id',
        'alias',
        'role',
        'response_data',
        'submitted_at',
    ];

    protected $casts = [
        'response_data' => 'array',
        'submitted_at' => 'datetime',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
