<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamsGraph extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
			'user_id' => $this->user_id,
			'exam_id' => $this->exam_id,
			'score' => $this->score,
			'correct' => $this->correct,
			'incorrect' => $this->incorrect,
			'accuracy' => $this->accuracy,
			'created_at' => Carbon::parse($this->created_at)->format('d/m/Y'),
            'exam' => $this->exam,
        ];
    }
}
