<?php

namespace App\Http\Resources;

use App\Models\ExamResult;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamsPrevious extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $resultCount = ExamResult::where([
                            'exam_id' => $this->exam->id,
                            'user_id' => auth()->user()->id,
                            'status' => 'done',
                        ])
                        ->orderBy('created_at', 'desc')
                        ->count();

        $startExam = 0;

        if ($this->exam->type == 'standard' && $resultCount < 2) $startExam = 1;

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'exam_id' => $this->exam_id,
            'start_exam' => $startExam,
            'score' => $this->score,
            'correct' => $this->correct,
            'incorrect' => $this->incorrect,
            'accuracy' => $this->accuracy,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'exam' => (object) [
                'id' => $this->exam->id,
                'name' => $this->exam->name,
                'slug' => $this->exam->slug,
                'type' => $this->exam->type,
                'duration' => $this->exam->duration,
                'total_section' => $this->exam->total_section,
            ],
        ];
    }
}
