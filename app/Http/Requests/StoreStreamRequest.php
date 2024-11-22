<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Platform;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreStreamRequest extends FormRequest
{
    public const string REG_EXP_DATE = '/(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/';

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'max:255'],
            'platform' => ['required', Rule::enum(Platform::class)],
            'start_at' => ['nullable', 'regex:' . self::REG_EXP_DATE],
            'end_at' =>  ['nullable', 'regex:' . self::REG_EXP_DATE],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
