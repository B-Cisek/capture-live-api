<?php

declare(strict_types=1);

namespace App\Services\AuthService\Concrete;

use App\Http\Requests\SignInRequest;
use App\Http\Requests\SignUpRequest;
use App\Models\User;
use App\Repositories\User\UserRepositoryInterface;
use App\Services\AuthService\Events\UserLoggedIn;
use App\Services\AuthService\Events\UserRegistered;
use App\Services\AuthService\Exceptions\EmailAlreadyExistsException;
use App\Services\AuthService\Exceptions\InvalidCredentialsException;
use App\Services\AuthService\Interfaces\AuthService as AuthServiceInterface;
use Illuminate\Contracts\Hashing\Hasher;

final readonly class AuthService implements AuthServiceInterface
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private Hasher $hasher,
    ) {}

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
            throw new InvalidCredentialsException();
        }

        if (! $this->hasher->check($request->get('password'), $user->password)) {
            throw new InvalidCredentialsException();
        }

        UserLoggedIn::dispatch($user);

        return $user;
    }
}
