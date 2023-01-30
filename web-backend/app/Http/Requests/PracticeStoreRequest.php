<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class PracticeStoreRequest extends FormRequest
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
            'topics' => 'sometimes|array',
            'topics.*' => 'required|integer',
            'exam_category_id' => 'required|integer',
            'exam_type_id' => 'sometimes|integer',
            'name' => 'required|string',
            'start_date' => 'required|date_format:Y-m-d|after_or_equal:' . Date('Y-m-d'),
            'start_time' => 'required|date_format:H:i',
            'instruction' => 'required|string',
            'duration' => 'sometimes|integer',
            'consentments' => 'required|array|min:1',
            'consentments.*' => 'required|string',
            'sections' => 'required|array|min:1',
            'sections.*.name' => 'required|string',
            'sections.*.duration' => 'required_without:duration|integer',
            'sections.*.instruction' => 'required|string',
        ];
    }

    public function messages() 
    {
        return [
            'topics.*.required' => 'Field is required.',
            'topics.*.integer' => 'Must be an integer.',
            'consentments.*.required' => 'Field is required.',
            'consentments.*.string' => 'Must be a string.',
            'sections.*.name.required' => 'Field is required.',
            'sections.*.name.string' => 'Must be a string.',
            'sections.*.duration.integer' => 'Must be an integer.',
            'sections.*.instruction.required' => 'Field is required.',
            'sections.*.instruction.string' => 'Must be a string.',
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
