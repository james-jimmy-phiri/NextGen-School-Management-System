<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGradeLevelRequest extends FormRequest
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
                Rule::unique('grade_levels')->where('school_id', $this->user()->school_id)
            ],
            'label' => ['required', 'string', 'max:255'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
