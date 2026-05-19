<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGradeLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('classes.manage');
    }

    public function rules(): array
    {
        return [
            'code' => [
                'required', 'string', 'max:40',
                Rule::unique('grade_levels')->where('school_id', $this->user()->school_id)->ignore($this->route('id'))
            ],
            'label' => ['required', 'string', 'max:255'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
