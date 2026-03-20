<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'first_name',
        'last_name',
        'email',
        'course',
        'year_level',
        'rfid_tag',
        'face_data',
        'profile_image',
        'status',
        'archived',
    ];

    protected function casts(): array
    {
        return [
            'archived' => 'boolean',
            'year_level' => 'integer',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')->where('archived', false);
    }

    public function userAccount()
    {
        return $this->hasOne(User::class, 'student_record_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }
}
