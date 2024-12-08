<?php

namespace App\Services\EventHandler\Interfaces;

interface Event
{
    public function __invoke(array $data): void;
}
