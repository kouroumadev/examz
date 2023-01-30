<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class PracticeUpdateQuestionRequest extends FormRequest
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
            'level' => 'sometimes|' . Rule::in(['easy', 'medium', 'hard']),
            'tag' => 'sometimes|string',
            'instruction' => 'sometimes|string',
            'paragraph' => 'sometimes|string',
            'question_items' => 'required|array|min:1',
            'question_items.*.id' => 'required|integer',
            'question_items.*.level' => Rule::in(['easy', 'medium', 'hard']),
            'question_items.*.tag' => 'required|string',
            'question_items.*.question' => 'required|string',
            'question_items.*.answer_type' => Rule::in(['single', 'multiple']),
            'question_items.*.answer_explanation' => 'required|string',
            'question_items.*.mark' => 'required|numeric|gte:0',
            'question_items.*.negative_mark' => 'required|numeric|gte:0',
            'question_items.*.deleted' => 'sometimes|boolean',
            'question_items.*.options' => 'required|array|min:1',
            'question_items.*.options.*.id' => 'required|integer',
            'question_items.*.options.*.title' => 'required|string',
            'question_items.*.options.*.correct' => 'required|boolean',
            'question_items.*.options.*.deleted' => 'sometimes|boolean',
        ];
    }

    public function messages() 
    {
        return [
            'question_items.*.id.required' => 'Field is required.',
            'question_items.*.id.integer' => 'Must be an integer.',
            'question_items.*.level.in' => 'Selected is invalid.',
            'question_items.*.tag.required' => 'Field is required.',
            'question_items.*.tag.string' => 'Must be a string.',
            'question_items.*.question.required' => 'Field is required.',
            'question_items.*.question.string' => 'Must be a string.',
            'question_items.*.answer_type.in' => 'Selected is invalid.',
            'question_items.*.answer_explanation.required' => 'Field is required.',
            'question_items.*.answer_explanation.string' => 'Must be a string.',
            'question_items.*.mark.required' => 'Field is required.',
            'question_items.*.mark.numeric' => 'Must be a number.',
            'question_items.*.negative_mark.required' => 'Field is required.',
            'question_items.*.negative_mark.numeric' => 'Must be a number.',
            'question_items.*.deleted.boolean' => 'Field must be true or false.',
            'question_items.*.options.*.id.required' => 'Field is required.',
            'question_items.*.options.*.id.integer' => 'Must be an integer.',
            'question_items.*.options.*.title.required' => 'Field is required.',
            'question_items.*.options.*.title.string' => 'Must be a string.',
            'question_items.*.options.*.correct.required' => 'Field is required.',
            'question_items.*.options.*.correct.boolean' => 'Field must be true or false.',
            'question_items.*.options.*.deleted.boolean' => 'Field must be true or false.',
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
