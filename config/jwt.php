<?php

return [
    'secret' => env('JWT_SECRET'),
    'exp' => env('JWT_EXPIRATION_DAYS', 7),
];
