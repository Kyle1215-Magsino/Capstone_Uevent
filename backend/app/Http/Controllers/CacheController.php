<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;

class CacheController extends Controller
{
    public function clear(): JsonResponse
    {
        try {
            Cache::flush();
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');
            
            return response()->json(['message' => 'Cache cleared successfully.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to clear cache.'], 500);
        }
    }
}
