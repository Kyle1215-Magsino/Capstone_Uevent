<?php

namespace App\Services;

use App\Models\Fine;
use App\Models\Attendance;
use App\Models\Event;
use Carbon\Carbon;

class FineCalculationService
{
    const FINE_AMOUNT = 25.00;
    
    /**
     * Calculate and create fines for an attendance record
     */
    public static function calculateFinesForAttendance(Attendance $attendance)
    {
        $event = $attendance->event;
        
        // Only process if event has defined periods (whole-day event)
        if (!$event->is_whole_day) {
            return;
        }
        
        $fines = [];
        
        // Check morning time-in
        if (self::isMorningTimeInViolation($attendance, $event)) {
            $fines[] = self::createFine($attendance, 'morning_in', self::determineViolationType($attendance));
        }
        
        // Check morning time-out
        if (self::isMorningTimeOutViolation($attendance, $event)) {
            $fines[] = self::createFine($attendance, 'morning_out', self::determineViolationType($attendance));
        }
        
        // Check afternoon time-in
        if (self::isAfternoonTimeInViolation($attendance, $event)) {
            $fines[] = self::createFine($attendance, 'afternoon_in', self::determineViolationType($attendance));
        }
        
        // Check afternoon time-out
        if (self::isAfternoonTimeOutViolation($attendance, $event)) {
            $fines[] = self::createFine($attendance, 'afternoon_out', self::determineViolationType($attendance));
        }
        
        return $fines;
    }
    
    private static function isMorningTimeInViolation(Attendance $attendance, Event $event)
    {
        if (!$attendance->check_in_time) {
            return true; // Absent
        }
        
        $checkInTime = Carbon::parse($attendance->check_in_time);
        $morningStart = Carbon::parse($event->event_date . ' ' . $event->morning_start_time);
        
        // Late if more than 15 minutes after morning start
        return $checkInTime->gt($morningStart->addMinutes(15));
    }
    
    private static function isMorningTimeOutViolation(Attendance $attendance, Event $event)
    {
        // If no check-out time for morning period
        return !$attendance->morning_check_out_time;
    }
    
    private static function isAfternoonTimeInViolation(Attendance $attendance, Event $event)
    {
        // If no afternoon check-in time
        if (!$attendance->afternoon_check_in_time) {
            return true;
        }
        
        $checkInTime = Carbon::parse($attendance->afternoon_check_in_time);
        $afternoonStart = Carbon::parse($event->event_date . ' ' . $event->afternoon_start_time);
        
        // Late if more than 15 minutes after afternoon start
        return $checkInTime->gt($afternoonStart->addMinutes(15));
    }
    
    private static function isAfternoonTimeOutViolation(Attendance $attendance, Event $event)
    {
        // If no check-out time for afternoon period
        return !$attendance->check_out_time;
    }
    
    private static function determineViolationType(Attendance $attendance)
    {
        if ($attendance->status === 'absent') {
            return 'absent';
        } elseif ($attendance->status === 'late') {
            return 'late';
        } else {
            return 'incomplete';
        }
    }
    
    private static function createFine(Attendance $attendance, string $period, string $violationType)
    {
        return Fine::create([
            'student_id' => $attendance->student_id,
            'event_id' => $attendance->event_id,
            'period' => $period,
            'violation_type' => $violationType,
            'amount' => self::FINE_AMOUNT,
            'payment_status' => 'unpaid',
        ]);
    }
    
    /**
     * Calculate total fines for a student
     */
    public static function getTotalFinesForStudent(int $studentId, string $status = null)
    {
        $query = Fine::where('student_id', $studentId);
        
        if ($status) {
            $query->where('payment_status', $status);
        }
        
        return $query->sum('amount');
    }
    
    /**
     * Mark fine as paid
     */
    public static function markAsPaid(Fine $fine)
    {
        $fine->update([
            'payment_status' => 'paid',
            'paid_at' => now(),
        ]);
    }
    
    /**
     * Waive a fine
     */
    public static function waiveFine(Fine $fine, int $waivedBy, string $reason)
    {
        $fine->update([
            'payment_status' => 'waived',
            'waived_by' => $waivedBy,
            'waiver_reason' => $reason,
        ]);
    }
}
