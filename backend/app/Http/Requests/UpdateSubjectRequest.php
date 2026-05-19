<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('subjects.manage');
    }

    public function rules(): array
    {
        return [
            'code' => [
                'required', 'string', 'max:40',
                Rule::unique('subjects')->where('school_id', $this->user()->school_id)->ignore($this->route('id'))
            ],
            'name' => ['required', 'string', 'max:255'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'type' => ['string', Rule::in(['compulsory', 'elective'])],
            'gpa_weight' => ['numeric', 'min:0'],
            'pass_mark' => ['numeric', 'min:0', 'max:100'],
            'teacher_id' => ['nullable', 'exists:users,id'],
        ];
    }
}
