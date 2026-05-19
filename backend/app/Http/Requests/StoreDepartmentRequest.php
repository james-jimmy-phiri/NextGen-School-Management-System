<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('subjects.manage'); // Re-using subjects manage for departments per implementation plan
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('departments')->where('school_id', $this->user()->school_id)
            ],
            'type' => ['string', Rule::in(['academic', 'administrative'])],
            'description' => ['nullable', 'string'],
            'head_of_department_id' => ['nullable', 'exists:users,id'],
        ];
    }
}
