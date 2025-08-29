<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AssetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'team_id' => $this->team_id,
            'name' => $this->name,
            'crc' => $this->properties['crc'],
            'unity_version' => $this->properties['unity_version'],
            'url' => asset(Storage::url($this->properties['bundle'])),
            'assets' => $this->properties['assets'],
        ];
    }
}
