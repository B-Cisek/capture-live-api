<?php

namespace App\Repositories\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UserRepository implements UserRepositoryInterface
{
    public function existsByEmail(string $email): bool
    {
        return User::where('email', $email)->exists();
    }

    public function create(FormRequest $user): User
    {
        $model = new User();
        $model->email = $user->validated('email');
        $model->password = $user->validated('password');
        $model->saveOrFail();

        return $model;
    }
}
