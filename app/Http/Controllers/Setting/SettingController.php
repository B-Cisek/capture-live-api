<?php

declare(strict_types=1);

namespace App\Http\Controllers\Setting;

use App\Enums\Setting as SettingEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSettingsRequest;
use App\Models\Setting;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class SettingController extends Controller
{
    public function __construct(
        private readonly ResponseFactory $response,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $settings = Setting::query()
            ->where('user_id', $request->user()->id)
            ->pluck('value', 'name');

        return $this->response->json($settings);
    }

    public function store(StoreSettingsRequest $request): Response
    {
        $settings = $request->validated();

        foreach ($settings as $setting) {
            if ($this->isSettingExist($setting['name'])) {
                Setting::query()->updateOrInsert(
                    [
                        'name' => $setting['name'],
                        'user_id' => $request->user()->id,
                    ],
                    [
                        'value' => $setting['value']
                    ]
                );
            }
        }

        return $this->response->noContent();
    }

    private function isSettingExist(string $key): bool
    {
        return (bool) SettingEnum::tryFrom($key);
    }
}
