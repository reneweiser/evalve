<?php

namespace App\Evalve\Consensive;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

final class Vr4MorePoiService
{
    public function getPois(): array
    {
        $accessToken = Cache::remember('vr4more_auth_token', 3600 * 6, function () {
            $user = config('services.vr4more.user');
            $password = config('services.vr4more.password');

            return Http::withBasicAuth($user, $password)
                ->post(config('services.vr4more.url').'/login/')
                ->json('accessToken');
        });

        $url = config('services.vr4more.url')
            .'/scenes/'
            .config('services.vr4more.scene_id')
            .'/pois/?mode=full';

        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'Authorization' => "Token $accessToken",
            'Content-Type' => 'application/json',
        ])
            ->get($url);

        return $response->json();
    }
}
