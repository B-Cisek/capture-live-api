<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class StoreSettingsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            '*.name' => ['required', 'string'],
            '*.value' => ['required', 'string'],
        ];
    }
}
