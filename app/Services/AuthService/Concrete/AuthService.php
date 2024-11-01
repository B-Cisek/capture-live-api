<?php

namespace App\Services\AuthService\Concrete;

use App\Http\Requests\SignInRequest;
use App\Models\User;
use App\Http\Requests\SignUpRequest;
use App\Repositories\User\UserRepositoryInterface;
use App\Services\AuthService\Events\UserRegistered;
use App\Services\AuthService\Exceptions\EmailAlreadyExistsException;
use App\Services\AuthService\Interfaces\AuthService as AuthServiceInterface;
use Illuminate\Contracts\Hashing\Hasher;

readonly class AuthService implements AuthServiceInterface
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private Hasher $hasher
    )
    {
    }

    public function signup(SignUpRequest $request): User
    {
        if ($this->userRepository->existsByEmail($request->validated('email'))) {
            throw new EmailAlreadyExistsException();
        }

        $user = new User();
        $user->fill($request->validated());
        $user->saveOrFail();

        UserRegistered::dispatch($user);

        return $user;
    }

    public function signin(SignInRequest $request): User
    {
        $user = User::where('email', $request->get('email'))->first();

        if (! ($user instanceof User)) {
            throw new \Exception('Credentials do not match');
        }

        if (! $this->hasher->check($request->get('password'), $user->password)) {
            throw new \Exception('Credentials do not match');
        }

        return $user;
    }
}
