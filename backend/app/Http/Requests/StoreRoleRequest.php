<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('roles.manage');
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $reserved = config('rbac.system_role_names', []);

        return [
            'name' => [
                'required',
                'string',
                'max:64',
                'regex:/^[a-z][a-z0-9_]*$/',
                Rule::unique('roles', 'name')->where('guard_name', 'web'),
                Rule::notIn($reserved),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'Use lowercase letters, numbers, and underscores only. Must start with a letter.',
            'name.not_in' => 'This name is reserved for a built-in role.',
        ];
    }
}
