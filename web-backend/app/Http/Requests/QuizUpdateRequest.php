<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class QuizUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'topic_id' => 'sometimes|integer',
            'name' => 'required|string',
            'type' => Rule::in(['mixed', 'live']),
            'status' => Rule::in(['published', 'draft']),
            'duration' => 'required|integer',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
            'start_time' => 'sometimes|date_format:Y-m-d H:i|after_or_equal:' . Date('Y-m-d H:i'),
            'end_time' => 'sometimes|date_format:Y-m-d H:i|after_or_equal:start_time',
            'instruction' => 'required|string',
            'consentments' => 'required|array|min:1',
            'consentments.*' => 'required|string',
            'questions' => 'required|array|min:1',
            'questions.*.id' => 'required|integer',
            'questions.*.level' => Rule::in(['easy', 'medium', 'hard']),
            'questions.*.tag' => 'required|string',
            'questions.*.question' => 'required|string',
            'questions.*.answer_type' => Rule::in(['single', 'multiple']),
            'questions.*.answer_explanation' => 'required|string',
            'questions.*.mark' => 'required|numeric|gte:0',
            'questions.*.negative_mark' => 'required|numeric|gte:0',
            'questions.*.options' => 'required|array|min:1',
            'questions.*.options.*.id' => 'required|integer',
            'questions.*.options.*.title' => 'required|string',
            'questions.*.options.*.correct' => 'required|boolean',
            'questions.*.options.*.deleted' => 'sometimes|boolean',
        ];
    }

    public function messages() 
    {
        return [
            'consentments.*.required' => 'Field is required.',
            'consentments.*.string' => 'Must be a string.',
            'questions.*.id.required' => 'Field is required.',
            'questions.*.id.integer' => 'Must be an integer.',
            'questions.*.level.in' => 'Selected is invalid.',
            'questions.*.tag.required' => 'Field is required.',
            'questions.*.tag.string' => 'Must be a string.',
            'questions.*.question.required' => 'Field is required.',
            'questions.*.question.string' => 'Must be a string.',
            'questions.*.answer_type.in' => 'Selected is invalid.',
            'questions.*.answer_explanation.required' => 'Field is required.',
            'questions.*.answer_explanation.string' => 'Must be a string.',
            'questions.*.mark.required' => 'Field is required.',
            'questions.*.mark.numeric' => 'Must be a number.',
            'questions.*.negative_mark.required' => 'Field is required.',
            'questions.*.negative_mark.numeric' => 'Must be a number.',
            'questions.*.options.*.id.required' => 'Field is required.',
            'questions.*.options.*.id.integer' => 'Must be an integer.',
            'questions.*.options.*.title.required' => 'Field is required.',
            'questions.*.options.*.title.string' => 'Must be a string.',
            'questions.*.options.*.correct.required' => 'Field is required.',
            'questions.*.options.*.correct.boolean' => 'Field must be true or false.',
            'questions.*.options.*.deleted.boolean' => 'Field must be true or false.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Validation error',
            'data' => $validator->errors(),
        ], 400));
    }
}
