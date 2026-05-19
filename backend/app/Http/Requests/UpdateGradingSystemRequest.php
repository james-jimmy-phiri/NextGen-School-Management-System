<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGradingSystemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('grading.manage');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['string', Rule::in(['gpa', 'percentage', 'custom'])],
            'is_default' => ['boolean'],
            'scales' => ['array'],
            'scales.*.id' => ['nullable', 'exists:grading_scales,id'],
            'scales.*.min_score' => ['required', 'numeric', 'min:0'],
            'scales.*.max_score' => ['required', 'numeric', 'min:0'],
            'scales.*.grade' => ['required', 'string', 'max:10'],
            'scales.*.remark' => ['nullable', 'string', 'max:255'],
            'scales.*.points' => ['required', 'numeric', 'min:0'],
        ];
    }
}
