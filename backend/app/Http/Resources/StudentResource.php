<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Student
 */
class StudentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'user_id' => $this->user_id,
            'admission_number' => $this->admission_number,
            'full_name' => trim($this->first_name.' '.$this->last_name),
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'gender' => $this->gender,
            'status' => $this->status,
            'photo_path' => $this->photo_path,
            'enrollment_date' => $this->enrollment_date,
            'guardians' => GuardianResource::collection($this->whenLoaded('guardians')),
            'enrollments' => StudentEnrollmentResource::collection($this->whenLoaded('enrollments')),
        ];
    }
}
