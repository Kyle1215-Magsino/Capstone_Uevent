<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\Event;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // Create 3 additional officer accounts
        $officers = [
            ['name' => 'Sofia Martinez', 'email' => 'sofia.martinez@minsu.edu.ph'],
            ['name' => 'Gabriel Cruz',   'email' => 'gabriel.cruz@minsu.edu.ph'],
            ['name' => 'Angela Reyes',   'email' => 'angela.reyes@minsu.edu.ph'],
        ];
        foreach ($officers as $o) {
            if (!User::where('email', $o['email'])->exists()) {
                User::create([
                    'name' => $o['name'],
                    'email' => $o['email'],
                    'password' => Hash::make('officer123'),
                    'role' => 'officer',
                ]);
            }
        }

        $admin = User::where('role', 'admin')->first();
        $createdBy = $admin?->id ?? 1;

        // Create 30 students across different courses
        $courses = ['BSIT', 'BSCS', 'BSED', 'BEED', 'BSA'];
        $firstNames = ['Maria', 'Juan', 'Ana', 'Pedro', 'Rosa', 'Carlos', 'Elena', 'Jose', 'Grace', 'Mark',
                        'Liza', 'Rico', 'Faith', 'Leo', 'Joy', 'Ryan', 'Ella', 'Kevin', 'Mia', 'Ian',
                        'April', 'Noel', 'Kris', 'Dan', 'Lea', 'Miguel', 'Jasmine', 'Paolo', 'Christine', 'Rafael'];
        $lastNames = ['Santos', 'Reyes', 'Cruz', 'Garcia', 'Torres', 'Flores', 'Lopez', 'Rivera', 'Gomez', 'Ramos',
                       'Diaz', 'Mendoza', 'Castillo', 'Bautista', 'Villanueva', 'Dela Cruz', 'Navarro', 'Perez', 'Aquino', 'Mercado',
                       'Pascual', 'Soriano', 'Tolentino', 'Manalo', 'Aguilar', 'Hernandez', 'Lim', 'De Leon', 'Valdez', 'Morales'];

        $students = [];
        foreach ($firstNames as $i => $first) {
            $course = $courses[$i % count($courses)];
            $students[] = Student::create([
                'student_id' => str_pad($i + 1, 5, '0', STR_PAD_LEFT),
                'first_name' => $first,
                'last_name' => $lastNames[$i],
                'email' => strtolower($first) . '.' . strtolower(str_replace(' ', '', $lastNames[$i])) . '@minsu.edu.ph',
                'course' => $course,
                'year_level' => rand(1, 4),
                'status' => 'active',
                'rfid_tag' => 'RFID-' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'archived' => false,
            ]);
        }

        // Create 12 events spread across the last 8 months
        $eventData = [
            ['event_name' => 'University Foundation Day', 'venue' => 'Main Auditorium', 'months_ago' => 7],
            ['event_name' => 'Freshmen Orientation', 'venue' => 'University Gymnasium', 'months_ago' => 6],
            ['event_name' => 'IT Week Seminar', 'venue' => 'IT Building Hall', 'months_ago' => 5],
            ['event_name' => 'Sports Fest Opening', 'venue' => 'University Gymnasium', 'months_ago' => 4],
            ['event_name' => 'Academic Congress', 'venue' => 'Conference Room A', 'months_ago' => 4],
            ['event_name' => 'Cultural Night', 'venue' => 'Main Auditorium', 'months_ago' => 3],
            ['event_name' => 'Science Fair', 'venue' => 'Library Hall', 'months_ago' => 2],
            ['event_name' => 'Research Colloquium', 'venue' => 'IT Building Hall', 'months_ago' => 2],
            ['event_name' => 'Leadership Summit', 'venue' => 'Conference Room B', 'months_ago' => 1],
            ['event_name' => 'Community Outreach', 'venue' => 'Bongabong Town Plaza', 'months_ago' => 0],
            ['event_name' => 'Career Fair 2026', 'venue' => 'University Gymnasium', 'months_ago' => -1],
            ['event_name' => 'Year-End Recognition', 'venue' => 'Main Auditorium', 'months_ago' => -2],
        ];

        $events = [];
        foreach ($eventData as $ed) {
            $date = Carbon::now()->subMonths($ed['months_ago']);
            $status = $ed['months_ago'] < 0 ? 'upcoming' : ($ed['months_ago'] === 0 ? 'ongoing' : 'completed');
            $events[] = Event::create([
                'event_name' => $ed['event_name'],
                'description' => 'A university-wide event at ' . $ed['venue'] . '.',
                'event_date' => $date->format('Y-m-d'),
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
                'venue' => $ed['venue'],
                'venue_lat' => 12.7553,
                'venue_lng' => 121.1707,
                'venue_radius' => 200,
                'status' => $status,
                'created_by' => $createdBy,
            ]);
        }

        // Create attendance records for past/ongoing events
        $methods = ['manual', 'rfid', 'facial'];
        foreach ($events as $event) {
            if ($event->status === 'upcoming') continue;

            // Random 60-90% of students attend each event
            $attendees = collect($students)->shuffle()->take(rand(18, 27));
            foreach ($attendees as $student) {
                $isLate = rand(1, 100) <= 25; // 25% chance of being late
                $checkInHour = $isLate ? rand(8, 10) : 8;
                $checkInMinute = $isLate ? rand(15, 55) : rand(0, 14);

                Attendance::create([
                    'student_id' => $student->id,
                    'event_id' => $event->id,
                    'check_in_time' => Carbon::parse($event->event_date)
                        ->setHour($checkInHour)->setMinute($checkInMinute)->setSecond(rand(0, 59)),
                    'verification_method' => $methods[array_rand($methods)],
                    'location_lat' => 12.7553 + (rand(-50, 50) / 10000),
                    'location_lng' => 121.1707 + (rand(-50, 50) / 10000),
                    'location_verified' => rand(0, 1) === 1,
                    'status' => $isLate ? 'late' : 'present',
                ]);
            }
        }

        $this->command->info('Demo data seeded: ' . count($students) . ' students, ' . count($events) . ' events, ' . Attendance::count() . ' attendance records, ' . User::where('role', 'officer')->count() . ' officers.');
    }
}
