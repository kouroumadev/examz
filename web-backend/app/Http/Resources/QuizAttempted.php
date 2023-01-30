<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizAttempted extends JsonResource
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
			'quiz_id' => $this->quiz_id,
			'start_quiz' => $this->start_quiz,
			'created_at' => Carbon::parse($this->created_at)->format('d/m/Y H:i'),
            'status' => $this->status,
            'quiz' => (object) [
                'id' => $this->quiz->id,
                'institute_id' => $this->quiz->institute_id,
				'topic_id' => $this->quiz->topic_id,
				'name' => $this->quiz->name,
				'slug' => $this->quiz->slug,
				'type' => $this->quiz->type,
				'duration' => $this->quiz->duration,
				'started'=> $this->quiz->started,
				'ended'=> $this->quiz->ended,
                'institute'=> $this->quiz->institute,
				'topic'=> $this->quiz->topic,
            ],
        ];
    }
}
