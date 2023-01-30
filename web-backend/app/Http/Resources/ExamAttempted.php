<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamAttempted extends JsonResource
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
			'exam_id' => $this->exam_id,
			'start_exam' => $this->start_exam,
			'created_at' => Carbon::parse($this->created_at)->format('d/m/Y H:i'),
            'status' => $this->status,
            'exam' => (object) [
                'id' => $this->exam->id,
                'institute_id' => $this->exam->institute_id,
				'name' => $this->exam->name,
				'slug' => $this->exam->slug,
				'type' => $this->exam->type,
				'duration' => $this->exam->duration,
				'total_section' => $this->exam->total_section,
				'started'=> $this->exam->started,
				'ended'=> $this->exam->ended,
				'topic'=> $this->exam->topic,
				'institute'=> $this->exam->institute,
            ],
        ];
    }
}
