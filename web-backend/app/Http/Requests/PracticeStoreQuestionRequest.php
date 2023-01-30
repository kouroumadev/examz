<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class PracticeStoreQuestionRequest extends FormRequest
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
            'section_id' => 'required|integer',
            'questions' => 'required|array',
            'questions.*.type' => Rule::in(['paragraph', 'simple']),
            'questions.*.level' => 'sometimes|' . Rule::in(['easy', 'medium', 'hard']),
            'questions.*.tag' => 'sometimes|string',
            'questions.*.instruction' => 'sometimes|string',
            'questions.*.paragraph' => 'sometimes|string',
            'questions.*.question_items' => 'required|array|min:1',
            'questions.*.question_items.*.level' => Rule::in(['easy', 'medium', 'hard']),
            'questions.*.question_items.*.tag' => 'required|string',
            'questions.*.question_items.*.question' => 'required|string',
            'questions.*.question_items.*.answer_type' => Rule::in(['single', 'multiple']),
            'questions.*.question_items.*.answer_explanation' => 'required|string',
            'questions.*.question_items.*.mark' => 'required|numeric|gte:0',
            'questions.*.question_items.*.negative_mark' => 'required|numeric|gte:0',
            'questions.*.question_items.*.options' => 'required|array|min:1',
            'questions.*.question_items.*.options.*.title' => 'required|string',
            'questions.*.question_items.*.options.*.correct' => 'required|boolean',
        ];
    }

    public function messages() 
    {
        return [
            'questions.*.type.in' => 'Selected is invalid.',
            'questions.*.level.in' => 'Selected is invalid.',
            'questions.*.tag.string' => 'Must be a string.',
            'questions.*.instruction.string' => 'Must be a string.',
            'questions.*.paragraph.string' => 'Must be a string.',
            'questions.*.question_items.*.level.in' => 'Selected is invalid.',
            'questions.*.question_items.*.tag.required' => 'Field is required.',
            'questions.*.question_items.*.tag.string' => 'Must be a string.',
            'questions.*.question_items.*.question.required' => 'Field is required.',
            'questions.*.question_items.*.question.string' => 'Must be a string.',
            'questions.*.question_items.*.answer_type.in' => 'Selected is invalid.',
            'questions.*.question_items.*.answer_explanation.required' => 'Field is required.',
            'questions.*.question_items.*.answer_explanation.string' => 'Must be a string.',
            'questions.*.question_items.*.mark.required' => 'Field is required.',
            'questions.*.question_items.*.mark.numeric' => 'Must be a number.',
            'questions.*.question_items.*.negative_mark.required' => 'Field is required.',
            'questions.*.question_items.*.negative_mark.numeric' => 'Must be a number.',
            'questions.*.question_items.*.options.*.title.required' => 'Field is required.',
            'questions.*.question_items.*.options.*.title.string' => 'Must be a string.',
            'questions.*.question_items.*.options.*.correct.required' => 'Field is required.',
            'questions.*.question_items.*.options.*.correct.boolean' => 'Field must be true or false.',
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
