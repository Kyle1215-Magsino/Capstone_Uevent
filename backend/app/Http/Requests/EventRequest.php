<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'venue' => 'required|string|max:255',
            'venue_lat' => 'nullable|numeric|between:-90,90',
            'venue_lng' => 'nullable|numeric|between:-180,180',
            'venue_radius' => 'nullable|integer|min:1',
            'status' => 'nullable|in:upcoming,ongoing,completed,cancelled',
        ];
    }
}
