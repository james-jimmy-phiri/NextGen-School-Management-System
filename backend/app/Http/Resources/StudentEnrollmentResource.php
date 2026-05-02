<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\StudentEnrollment
 */
class StudentEnrollmentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'stream_id' => $this->stream_id,
            'class_group_id' => $this->class_group_id,
            'academic_year_id' => $this->academic_year_id,
            'class_group' => $this->whenLoaded('classGroup', fn () => [
                'id' => $this->classGroup->id,
                'name' => $this->classGroup->name,
            ]),
            'academic_year' => $this->whenLoaded('academicYear', fn () => [
                'id' => $this->academicYear->id,
                'title' => $this->academicYear->title,
            ]),
        ];
    }
}
