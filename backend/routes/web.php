<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function () {
    return response()->json(['message' => 'U-EventTrack API Backend. Use /api endpoints.']);
})->where('any', '.*');
