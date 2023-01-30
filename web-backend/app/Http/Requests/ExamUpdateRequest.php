<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class ExamUpdateRequest extends FormRequest
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
            'branches' => 'sometimes|array',
            'branches.*' => 'required|integer',
            'batches' => 'sometimes|array',
            'batches.*' => 'required|integer',
            'topics' => 'sometimes|array',
            'topics.*' => 'required|integer',
            'exam_category_id' => 'required|integer',
            'exam_type_id' => 'sometimes|integer',
            'name' => 'required|string',
            'type' => Rule::in(['live', 'standard']),
            'start_date' => 'sometimes|date_format:Y-m-d|after_or_equal:' . Date('Y-m-d'),
            'end_date' => 'sometimes|date_format:Y-m-d|after_or_equal:start_date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'instruction' => 'required|string',
            'duration' => 'sometimes|integer',
            'consentments' => 'required|array|min:1',
            'consentments.*' => 'required|string',
            'sections' => 'required|array|min:1',
            'sections.*.id' => 'required|integer',
            'sections.*.name' => 'required|string',
            'sections.*.duration' => 'required_without:duration|integer',
            'sections.*.instruction' => 'required|string',
            'sections.*.deleted' => 'sometimes|boolean',
        ];
    }

    public function messages() 
    {
        return [
            'branches.*.required' => 'Field is required.',
            'branches.*.integer' => 'Must be an integer.',
            'batches.*.required' => 'Field is required.',
            'batches.*.integer' => 'Must be an integer.',
            'topics.*.required' => 'Field is required.',
            'topics.*.integer' => 'Must be an integer.',
            'consentments.*.required' => 'Field is required.',
            'consentments.*.string' => 'Must be a string.',
            'sections.*.id.required' => 'Field is required.',
            'sections.*.id.integer' => 'Must be an integer.',
            'sections.*.name.required' => 'Field is required.',
            'sections.*.name.string' => 'Must be a string.',
            'sections.*.duration.integer' => 'Must be an integer.',
            'sections.*.instruction.required' => 'Field is required.',
            'sections.*.instruction.string' => 'Must be a string.',
            'sections.*.deleted.boolean' => 'Field must be true or false.',
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
