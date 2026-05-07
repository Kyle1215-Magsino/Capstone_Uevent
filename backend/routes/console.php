<?php

use App\Services\EventAnnouncementService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule event announcement sync to run daily
Schedule::call(function () {
    EventAnnouncementService::syncAllEventAnnouncements();
})->daily()->at('06:00');

// Schedule event status updates to run every 5 minutes
Schedule::command('events:update-statuses')->everyFiveMinutes();
