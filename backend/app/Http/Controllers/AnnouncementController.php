<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /** Public: return only active announcements */
    public function public(): JsonResponse
    {
        $announcements = Announcement::where('active', true)
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($announcements);
    }

    /** Admin: return all announcements */
    public function index(): JsonResponse
    {
        $announcements = Announcement::with('creator:id,name')
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($announcements);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'tag'        => 'required|string|in:Event,Reminder,Info,Update,Alert',
            'text'       => 'required|string|max:500',
            'active'     => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $data['created_by'] = $request->user()->id;

        $announcement = Announcement::create($data);

        return response()->json($announcement, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $announcement = Announcement::findOrFail($id);

        $data = $request->validate([
            'tag'        => 'sometimes|string|in:Event,Reminder,Info,Update,Alert',
            'text'       => 'sometimes|string|max:500',
            'active'     => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $announcement->update($data);

        return response()->json($announcement);
    }

    public function destroy(int $id): JsonResponse
    {
        Announcement::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted.']);
    }
}
