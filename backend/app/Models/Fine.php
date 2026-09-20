<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'event_id',
        'period',
        'violation_type',
        'amount',
        'payment_status',
        'paid_at',
        'waived_by',
        'waiver_reason',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function waivedBy()
    {
        return $this->belongsTo(User::class, 'waived_by');
    }

    public function scopeUnpaid($query)
    {
        return $query->where('payment_status', 'unpaid');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    public function scopeWaived($query)
    {
        return $query->where('payment_status', 'waived');
    }
}
