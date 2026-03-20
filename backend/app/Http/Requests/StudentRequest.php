<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentId = $this->route('id');

        $rules = [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'year_level' => 'required|integer|min:1|max:6',
            'rfid_tag' => 'nullable|string|max:255|unique:students,rfid_tag,' . $studentId,
            'profile_image' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ];

        if ($this->isMethod('POST')) {
            $rules['student_id'] = 'required|string|max:255|unique:students,student_id';
            $rules['email'] = 'required|email|max:255|unique:students,email';
        } else {
            $rules['student_id'] = 'required|string|max:255|unique:students,student_id,' . $studentId;
            $rules['email'] = 'required|email|max:255|unique:students,email,' . $studentId;
        }

        return $rules;
    }
}
