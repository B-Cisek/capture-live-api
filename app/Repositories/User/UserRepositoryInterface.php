<?php

declare(strict_types=1);

namespace App\Repositories\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

interface UserRepositoryInterface
{
    public function existsByEmail(string $email): bool;
    public function create(FormRequest $user): User;
}
