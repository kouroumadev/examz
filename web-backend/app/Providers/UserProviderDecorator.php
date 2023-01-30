<?php

namespace App\Providers;

use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Support\Facades\Log;

class UserProviderDecorator implements UserProvider
{
    /**
     * @var UserProvider
     */
    private $provider;

    /**
     * @var Repository
     */
    private $cache;
    private const DEFAULT_TTL = 300;

    public function __construct(UserProvider $provider, Repository $cache)
    {
        $this->provider = $provider;
        $this->cache = $cache;
    }

    /**
     * {@inheritDoc}
     */
    public function retrieveById($identifier)
    {
        $ttl = intval(env("USER_TTL", self::DEFAULT_TTL));
        if ($ttl == 0) {
            $ttl = self::DEFAULT_TTL;
        }
        return $this->cache->remember('user::' . $identifier, $ttl, function () use ($identifier) {
            return $this->provider->retrieveById($identifier);
        });
    }

    /**
     * {@inheritDoc}
     */
    public function retrieveByToken($identifier, $token)
    {
        return $this->provider->retrieveById($identifier, $token);
    }

    /**
     * {@inheritDoc}
     */
    public function updateRememberToken(Authenticatable $user, $token)
    {
        return $this->provider->updateRememberToken($user, $token);
    }

    /**
     * {@inheritDoc}
     */
    public function retrieveByCredentials(array $credentials)
    {
        return $this->provider->retrieveByCredentials($credentials);
    }

    /**
     * {@inheritDoc}
     */
    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        return $this->provider->validateCredentials($user, $credentials);
    }
}
