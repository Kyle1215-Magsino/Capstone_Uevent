<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\Event;
use Carbon\Carbon;

class EventAnnouncementService
{
    /**
     * Create announcement for an event based on proximity to event date
     */
    public static function createEventAnnouncement(Event $event): void
    {
        $eventDate = Carbon::parse($event->event_date);
        $now = Carbon::now();
        $daysUntil = (int) $now->diffInDays($eventDate, false);

        // Only create announcements for upcoming events
        if ($daysUntil < 0 || $event->status === 'completed' || $event->status === 'cancelled') {
            return;
        }

        // Determine if we should create an announcement
        $shouldAnnounce = false;
        $tag = 'Event';
        $text = '';

        if ($daysUntil === 0) {
            // Event is today
            $shouldAnnounce = true;
            $tag = 'Alert';
            $text = "🎯 Today: {$event->event_name} at {$event->venue}";
            if ($event->start_time) {
                $text .= " - " . Carbon::parse($event->start_time)->format('g:i A');
            }
        } elseif ($daysUntil === 1) {
            // Event is tomorrow
            $shouldAnnounce = true;
            $tag = 'Reminder';
            $text = "📍 Tomorrow: {$event->event_name} at {$event->venue}";
        } elseif ($daysUntil <= 3) {
            // Event is within 3 days
            $shouldAnnounce = true;
            $tag = 'Event';
            $text = "📅 In " . floor($daysUntil) . " days: {$event->event_name} at {$event->venue}";
        } elseif ($daysUntil <= 7) {
            // Event is within a week
            $shouldAnnounce = true;
            $tag = 'Event';
            $text = "📅 Upcoming: {$event->event_name} on {$eventDate->format('M j')} at {$event->venue}";
        }

        if ($shouldAnnounce) {
            // Check if announcement already exists for this event
            $existingAnnouncement = Announcement::where('text', 'like', "%{$event->event_name}%")
                ->where('active', true)
                ->first();

            if (!$existingAnnouncement) {
                Announcement::create([
                    'tag' => $tag,
                    'text' => $text,
                    'active' => true,
                    'sort_order' => $daysUntil === 0 ? 0 : ($daysUntil === 1 ? 1 : 10),
                    'created_by' => $event->created_by,
                ]);
            }
        }
    }

    /**
     * Update or deactivate announcements for an event
     */
    public static function updateEventAnnouncement(Event $event): void
    {
        // Find existing announcements for this event
        $announcements = Announcement::where('text', 'like', "%{$event->event_name}%")
            ->where('active', true)
            ->get();

        // If event is completed or cancelled, deactivate announcements
        if (in_array($event->status, ['completed', 'cancelled'])) {
            foreach ($announcements as $announcement) {
                $announcement->update(['active' => false]);
            }
            return;
        }

        // Otherwise, recreate the announcement with updated info
        foreach ($announcements as $announcement) {
            $announcement->delete();
        }

        self::createEventAnnouncement($event);
    }

    /**
     * Check all upcoming events and create/update announcements
     */
    public static function syncAllEventAnnouncements(): void
    {
        $upcomingEvents = Event::whereIn('status', ['upcoming', 'ongoing'])
            ->where('event_date', '>=', Carbon::now()->subDay())
            ->where('event_date', '<=', Carbon::now()->addWeek())
            ->get();

        foreach ($upcomingEvents as $event) {
            self::createEventAnnouncement($event);
        }
    }
}
