<?php

namespace App\Http\Requests;

use App\Models\Role;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('users.create');
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('role') && ! $this->has('roles')) {
            $this->merge(['roles' => array_values(array_filter([$this->input('role')]))]);
        } elseif ($this->has('roles') && is_array($this->input('roles')) && ! $this->has('role')) {
            $this->merge(['role' => $this->input('roles')[0] ?? null]);
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => [
                'nullable',
                'string',
                Rule::exists('roles', 'name')->where('guard_name', 'web'),
            ],
            'roles' => ['required_without:role', 'array', 'min:1'],
            'roles.*' => [
                'string',
                Rule::exists('roles', 'name')->where('guard_name', 'web'),
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if ($value === 'super_admin' && ! $this->user()->isSuperAdmin()) {
                        $fail('You cannot assign the super administrator role.');
                    }
                },
            ],
            'school_id' => [
                Rule::requiredIf(function () {
                    if (! $this->user()?->isSuperAdmin()) {
                        return false;
                    }
                    $roleNames = (array) ($this->input('roles') ?? ($this->input('role') ? [$this->input('role')] : []));
                    if (empty($roleNames)) {
                        return false;
                    }
                    $roles = Role::whereIn('name', $roleNames)->where('guard_name', 'web')->get();
                    return $roles->contains(fn ($r) => $r->name !== 'super_admin' && (bool) ($r->requires_school ?? true));
                }),
                'nullable',
                'exists:schools,id',
            ],
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
        ];
    }

    public function messages(): array
    {
        return [
            'school_id.required' => 'A school must be selected for this role.',
        ];
    }
}
