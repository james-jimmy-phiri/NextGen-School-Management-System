<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status,
            'avatar_initials' => $this->avatar_initials,
            'last_login_at' => $this->last_login_at?->toDateTimeString(),
            'last_login_ip' => $this->last_login_ip,
            'school' => [
                'id' => $this->school?->id,
                'name' => $this->school?->name,
            ],
            'role' => $this->roles->first()?->name,
            'permissions' => $this->getPermissionNames(),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
