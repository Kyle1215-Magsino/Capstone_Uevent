<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Check if students table has rfid_tag column, if so rename it
        if (Schema::hasColumn('students', 'rfid_tag')) {
            Schema::table('students', function (Blueprint $table) {
                $table->renameColumn('rfid_tag', 'barcode');
            });
        }

        // Step 1: Modify the enum to include 'barcode' temporarily
        DB::statement("ALTER TABLE attendances MODIFY COLUMN verification_method ENUM('rfid', 'barcode', 'facial', 'manual') DEFAULT 'manual'");

        // Step 2: Update existing 'rfid' records to 'barcode'
        DB::statement("UPDATE attendances SET verification_method = 'barcode' WHERE verification_method = 'rfid'");

        // Step 3: Remove 'rfid' from enum, keeping only 'barcode', 'facial', 'manual'
        DB::statement("ALTER TABLE attendances MODIFY COLUMN verification_method ENUM('barcode', 'facial', 'manual') DEFAULT 'manual'");
    }

    public function down(): void
    {
        // Step 1: Add 'rfid' back to enum temporarily
        DB::statement("ALTER TABLE attendances MODIFY COLUMN verification_method ENUM('rfid', 'barcode', 'facial', 'manual') DEFAULT 'manual'");

        // Step 2: Update 'barcode' records back to 'rfid'
        DB::statement("UPDATE attendances SET verification_method = 'rfid' WHERE verification_method = 'barcode'");

        // Step 3: Remove 'barcode' from enum
        DB::statement("ALTER TABLE attendances MODIFY COLUMN verification_method ENUM('rfid', 'facial', 'manual') DEFAULT 'manual'");

        // Step 4: Rename column back in students table if it exists
        if (Schema::hasColumn('students', 'barcode')) {
            Schema::table('students', function (Blueprint $table) {
                $table->renameColumn('barcode', 'rfid_tag');
            });
        }
    }
};
