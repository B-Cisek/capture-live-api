<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Platform;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateStreamRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'channel' => ['required', 'string', 'max:255'],
            'quality' => ['nullable', 'string', 'max:255'],
            'platform' => ['required', Rule::enum(Platform::class)],
            'start_at' => ['nullable', 'date'],
            'end_at' =>  ['nullable', 'date'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
