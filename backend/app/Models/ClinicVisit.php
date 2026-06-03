<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClinicVisit extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'date',
        'condition',
        'action',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
