<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use App\Services\FineCalculationService;
use Illuminate\Http\Request;

class FineController extends Controller
{
    /**
     * Get all fines (Admin/Officer)
     */
    public function index(Request $request)
    {
        $query = Fine::with(['student', 'event', 'waivedBy']);
        
        // Filter by payment status
        if ($request->has('status')) {
            $query->where('payment_status', $request->status);
        }
        
        // Filter by student
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        
        // Filter by event
        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }
        
        $fines = $query->latest()->paginate(20);
        
        return response()->json($fines);
    }
    
    /**
     * Get student's own fines
     */
    public function studentFines(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'student' || !$user->student_record_id) {
            return response()->json(['message' => 'Not authorized'], 403);
        }
        
        $fines = Fine::with(['event'])
            ->where('student_id', $user->student_record_id)
            ->latest()
            ->paginate(20);
        
        $totalUnpaid = FineCalculationService::getTotalFinesForStudent(
            $user->student_record_id,
            'unpaid'
        );
        
        return response()->json([
            'fines' => $fines,
            'total_unpaid' => $totalUnpaid,
        ]);
    }
    
    /**
     * Get fine statistics
     */
    public function statistics()
    {
        $stats = [
            'total_unpaid' => Fine::unpaid()->sum('amount'),
            'total_paid' => Fine::paid()->sum('amount'),
            'total_waived' => Fine::waived()->sum('amount'),
            'count_unpaid' => Fine::unpaid()->count(),
            'count_paid' => Fine::paid()->count(),
            'count_waived' => Fine::waived()->count(),
        ];
        
        return response()->json($stats);
    }
    
    /**
     * Mark fine as paid
     */
    public function markAsPaid(Request $request, Fine $fine)
    {
        FineCalculationService::markAsPaid($fine);
        
        return response()->json([
            'message' => 'Fine marked as paid successfully',
            'fine' => $fine->fresh(),
        ]);
    }
    
    /**
     * Waive a fine
     */
    public function waive(Request $request, Fine $fine)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);
        
        FineCalculationService::waiveFine(
            $fine,
            $request->user()->id,
            $request->reason
        );
        
        return response()->json([
            'message' => 'Fine waived successfully',
            'fine' => $fine->fresh(['waivedBy']),
        ]);
    }
    
    /**
     * Get fines report
     */
    public function report(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);
        
        $query = Fine::with(['student', 'event']);
        
        if ($request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        
        if ($request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        
        $fines = $query->get();
        
        $report = [
            'total_amount' => $fines->sum('amount'),
            'unpaid_amount' => $fines->where('payment_status', 'unpaid')->sum('amount'),
            'paid_amount' => $fines->where('payment_status', 'paid')->sum('amount'),
            'waived_amount' => $fines->where('payment_status', 'waived')->sum('amount'),
            'total_count' => $fines->count(),
            'by_period' => [
                'morning_in' => $fines->where('period', 'morning_in')->count(),
                'morning_out' => $fines->where('period', 'morning_out')->count(),
                'afternoon_in' => $fines->where('period', 'afternoon_in')->count(),
                'afternoon_out' => $fines->where('period', 'afternoon_out')->count(),
            ],
            'by_violation' => [
                'absent' => $fines->where('violation_type', 'absent')->count(),
                'late' => $fines->where('violation_type', 'late')->count(),
                'incomplete' => $fines->where('violation_type', 'incomplete')->count(),
            ],
            'fines' => $fines,
        ];
        
        return response()->json($report);
    }
}
