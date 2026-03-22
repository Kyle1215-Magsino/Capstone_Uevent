<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentRequest;
use App\Models\AuditLog;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(): JsonResponse
    {
        $students = Student::where('archived', false)
            ->orderBy('last_name')
            ->get();

        return response()->json($students);
    }

    public function store(StudentRequest $request): JsonResponse
    {
        $student = Student::create($request->validated());

        AuditLog::record('created', "Added student: {$student->first_name} {$student->last_name}", 'Student', $student->id, $request->user()?->id, $request->ip());

        return response()->json(['student' => $student, 'message' => 'Student created.'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $student = Student::with(['attendances.event'])->findOrFail($id);

        return response()->json($student);
    }

    public function update(StudentRequest $request, int $id): JsonResponse
    {
        $student = Student::findOrFail($id);
        $student->update($request->validated());

        AuditLog::record('updated', "Updated student: {$student->first_name} {$student->last_name}", 'Student', $student->id, $request->user()?->id, $request->ip());

        return response()->json(['student' => $student, 'message' => 'Student updated.']);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $student = Student::findOrFail($id);
        $student->update(['archived' => true]);

        AuditLog::record('deleted', "Archived student: {$student->first_name} {$student->last_name}", 'Student', $student->id, $request->user()?->id, $request->ip());

        return response()->json(['message' => 'Student archived.']);
    }

    public function archived(): JsonResponse
    {
        $students = Student::where('archived', true)
            ->orderBy('last_name')
            ->get();

        return response()->json($students);
    }

    public function restore(Request $request, int $id): JsonResponse
    {
        $student = Student::findOrFail($id);
        $student->update(['archived' => false, 'status' => 'active']);

        AuditLog::record('restored', "Restored student: {$student->first_name} {$student->last_name}", 'Student', $student->id, $request->user()?->id, $request->ip());

        return response()->json(['message' => 'Student restored.']);
    }

    public function search(Request $request): JsonResponse
    {
        $q = $request->query('q', '');

        $students = Student::where('archived', false)
            ->where(function ($query) use ($q) {
                $query->where('student_id', 'like', "%{$q}%")
                    ->orWhere('first_name', 'like', "%{$q}%")
                    ->orWhere('last_name', 'like', "%{$q}%");
            })
            ->orderBy('last_name')
            ->get();

        return response()->json($students);
    }

    public function saveFaceData(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'face_data' => 'nullable|string',
        ]);

        $student = Student::findOrFail($id);
        $student->update([
            'face_data'        => $request->face_data,
            'face_enrolled_at' => $request->face_data ? now() : null,
        ]);

        return response()->json(['message' => 'Face data saved.', 'face_enrolled_at' => $student->fresh()->face_enrolled_at]);
    }

    public function getFaceData(): JsonResponse
    {
        $students = Student::active()
            ->whereNotNull('face_data')
            ->where('face_data', '!=', '')
            ->select(['id', 'student_id', 'first_name', 'last_name', 'face_data', 'face_enrolled_at'])
            ->get();

        return response()->json($students);
    }
}
