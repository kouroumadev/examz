<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class PracticesAttempted extends JsonResource
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
            'user_id' => $this->user_id,
            'practice_id' => $this->practice_id,
            'created_at' => Carbon::parse($this->created_at)->format('d/m/Y H:i'),
            'status' => $this->status,
            'practice' => (object) [
                'id' => $this->practice->id,
                'institute_id' => $this->practice->institute_id,
                'name' => $this->practice->name,
                'slug' => $this->practice->slug,
                'start_date' => Carbon::createFromFormat('Y-m-d H:i:s', $this->practice->start_date)->diffForHumans(),
                'duration' => $this->practice->duration,
                'total_section' => $this->practice->total_section,
                'institute'=> $this->practice->institute,
            ],
        ];
    }
}
