<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Preferreds extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'exam_category_id' => $this->exam_category_id,
            'name' => $this->name,
            'pivot' => $this->pivot,
        ];
    }
}
