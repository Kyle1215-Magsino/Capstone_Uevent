<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'event_id',
        'check_in_time',
        'check_out_time',
        'verification_method',
        'location_lat',
        'location_lng',
        'location_verified',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'check_in_time' => 'datetime',
            'check_out_time' => 'datetime',
            'location_lat' => 'double',
            'location_lng' => 'double',
            'location_verified' => 'boolean',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
}
