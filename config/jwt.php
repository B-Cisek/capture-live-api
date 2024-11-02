<?php

declare(strict_types=1);

return [
    'secret' => env('JWT_SECRET'),
    'exp' => env('JWT_EXPIRATION_DAYS', 7),
];
