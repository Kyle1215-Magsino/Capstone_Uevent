<?php

namespace App\Console\Commands;

use App\Models\Student;
use Illuminate\Console\Command;

class CleanupInvalidCourses extends Command
{
    protected $signature = 'students:cleanup-courses';
    protected $description = 'Remove students with invalid course codes';

    public function handle(): int
    {
        $validCourses = ['BSEED', 'BSIT', 'BSCPE', 'BSFI', 'BSHM', 'BSCRIM', 'BSPOLSCI'];

        // Find students with invalid courses
        $invalidStudents = Student::whereNotIn('course', $validCourses)->get();

        if ($invalidStudents->isEmpty()) {
            $this->info('No students with invalid courses found.');
            return Command::SUCCESS;
        }

        $this->info("Found {$invalidStudents->count()} students with invalid courses:");
        
        foreach ($invalidStudents as $student) {
            $this->line("- {$student->student_id}: {$student->first_name} {$student->last_name} ({$student->course})");
        }

        if ($this->confirm('Do you want to delete these students?', false)) {
            $count = Student::whereNotIn('course', $validCourses)->delete();
            $this->info("Deleted {$count} students with invalid courses.");
        } else {
            $this->info('Cleanup cancelled.');
        }

        return Command::SUCCESS;
    }
}
