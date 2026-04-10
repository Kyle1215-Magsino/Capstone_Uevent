<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventRequest;
use App\Models\AuditLog;
use App\Models\Event;
use App\Services\EventAnnouncementService;
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

        // Create announcement if event is coming soon
        EventAnnouncementService::createEventAnnouncement($event);

        AuditLog::record('created', "Created event: {$event->event_name}", 'Event', $event->id, $request->user()->id, $request->ip());

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

        // Update announcement based on new event details
        EventAnnouncementService::updateEventAnnouncement($event);

        AuditLog::record('updated', "Updated event: {$event->event_name}", 'Event', $event->id, $request->user()->id, $request->ip());

        return response()->json(['event' => $event, 'message' => 'Event updated.']);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $name = $event->event_name;
        $event->delete();

        AuditLog::record('deleted', "Deleted event: {$name}", 'Event', $id, $request->user()->id, $request->ip());

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
