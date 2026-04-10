<?php

namespace App\Console\Commands;

use App\Services\EventAnnouncementService;
use Illuminate\Console\Command;

class SyncEventAnnouncements extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'events:sync-announcements';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync announcements for upcoming events';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Syncing event announcements...');

        EventAnnouncementService::syncAllEventAnnouncements();

        $this->info('Event announcements synced successfully!');

        return Command::SUCCESS;
    }
}
