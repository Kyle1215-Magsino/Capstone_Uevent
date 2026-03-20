<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventRequest;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Event::with('organizer');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('event_name', 'like', "%{$search}%")
                  ->orWhere('venue', 'like', "%{$search}%");
            });
        }

        $events = $query->orderByDesc('event_date')->paginate(10);

        return response()->json($events);
    }

    public function store(EventRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()->id;

        $event = Event::create($data);

        return response()->json(['event' => $event, 'message' => 'Event created.'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $event = Event::with(['organizer', 'attendances.student'])->findOrFail($id);

        $attendanceCounts = [
            'total' => $event->attendances->count(),
            'present' => $event->attendances->where('status', 'present')->count(),
            'late' => $event->attendances->where('status', 'late')->count(),
        ];

        return response()->json([
            'event' => $event,
            'attendanceCounts' => $attendanceCounts,
        ]);
    }

    public function update(EventRequest $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $event->update($request->validated());

        return response()->json(['event' => $event, 'message' => 'Event updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json(['message' => 'Event deleted.']);
    }

    public function active(): JsonResponse
    {
        $events = Event::whereIn('status', ['upcoming', 'ongoing'])
            ->orderBy('event_date')
            ->get();

        return response()->json($events);
    }
}
