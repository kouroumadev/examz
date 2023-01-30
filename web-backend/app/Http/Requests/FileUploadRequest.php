<?php

namespace App\Http\Requests;

use App\Rules\FileExtension;
use Illuminate\Foundation\Http\FormRequest;

class FileUploadRequest extends FormRequest
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
            'name' => ['required', 'string', new FileExtension(array("png", "jpeg", "jpg"))],
            'upload_type' => 'required|string',
            'upload_sub_type' => 'sometimes|string',
            'size' => 'required|numeric',
            'file_type' => 'required|string'
        ];
    }
}
