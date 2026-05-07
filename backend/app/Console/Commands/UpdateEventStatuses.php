<?php

namespace App\Console\Commands;

use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateEventStatuses extends Command
{
    protected $signature = 'events:update-statuses';
    protected $description = 'Update event statuses based on current date and time';

    public function handle(): int
    {
        $now = Carbon::now();
        $today = $now->toDateString();
        $currentTime = $now->toTimeString();

        // Update completed events (past end time)
        $completedCount = Event::where('status', '!=', 'cancelled')
            ->where(function ($query) use ($today, $currentTime) {
                // Events before today
                $query->where('event_date', '<', $today)
                    // OR events today but past end time
                    ->orWhere(function ($q) use ($today, $currentTime) {
                        $q->where('event_date', '=', $today)
                            ->where('end_time', '<', $currentTime);
                    });
            })
            ->update(['status' => 'completed']);

        // Update ongoing events (between start and end time today)
        $ongoingCount = Event::where('status', 'upcoming')
            ->where('event_date', '=', $today)
            ->where('start_time', '<=', $currentTime)
            ->where('end_time', '>=', $currentTime)
            ->update(['status' => 'ongoing']);

        // Update future ongoing events back to upcoming (fix incorrect statuses)
        $fixedCount = Event::where('status', 'ongoing')
            ->where('event_date', '>', $today)
            ->update(['status' => 'upcoming']);

        $this->info("Updated {$completedCount} events to completed");
        $this->info("Updated {$ongoingCount} events to ongoing");
        $this->info("Fixed {$fixedCount} incorrectly marked ongoing events");

        return Command::SUCCESS;
    }
}

