<?php

namespace App\Http\Requests;

use App\Enums\Platform;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStreamRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'max:255'],
            'platform' => ['required', Rule::enum(Platform::class)],
            'start_at' => ['nullable', 'date'],
            'end_at' =>  ['nullable', 'date'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
