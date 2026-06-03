<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAward extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'title',
        'category',
        'date',
        'description',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
