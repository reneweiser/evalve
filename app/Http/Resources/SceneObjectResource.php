<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SceneObjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
//        return parent::toArray($request);
        return [
            'id' => $this->id,
            'team_id' => $this->team_id,
            'name' => $this->name,
            'imageUrl' => $this->imageUrl,
            'transform' => $this->transform,
            'properties' => collect($this->properties)->values(),
        ];
    }
}
