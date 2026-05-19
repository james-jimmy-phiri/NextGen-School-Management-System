<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('subjects.manage');
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('departments')->where('school_id', $this->user()->school_id)->ignore($this->route('id'))
            ],
            'type' => ['string', Rule::in(['academic', 'administrative'])],
            'description' => ['nullable', 'string'],
            'head_of_department_id' => ['nullable', 'exists:users,id'],
        ];
    }
}
