<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        if (!User::where('email', 'admin@minsu.edu.ph')->exists()) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@minsu.edu.ph',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]);
        }

        if (!User::where('email', 'officer@minsu.edu.ph')->exists()) {
            User::create([
                'name' => 'Officer',
                'email' => 'officer@minsu.edu.ph',
                'password' => Hash::make('officer123'),
                'role' => 'officer',
            ]);
        }
    }
}
