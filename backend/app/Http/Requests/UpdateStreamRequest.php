<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStreamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('classes.manage');
    }

    public function rules(): array
    {
        return [
            'class_group_id' => ['required', 'exists:class_groups,id'],
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('streams')->where('class_group_id', $this->input('class_group_id'))->ignore($this->route('id'))
            ],
            'classroom' => ['nullable', 'string', 'max:255'],
            'capacity' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
