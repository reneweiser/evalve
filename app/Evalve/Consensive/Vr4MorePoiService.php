<?php

namespace App\Evalve\Consensive;

use App\Models\SceneObject;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class Vr4MorePoiService
{
    public function getPois(): array
    {
        $accessToken = $this->getAccessToken();

        $url = config('services.vr4more.url')
            .'/scenes/'
            .config('services.vr4more.scene_id')
            .'/pois/?mode=full';

        $response = Http::withHeaders([
            'Authorization' => "Token $accessToken",
            'Content-Type' => 'application/json',
        ])
            ->get($url);

        if (! $response->successful()) {
            Log::error('Failed to fetch POIs from VR4More', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new \Exception('Failed to fetch POIs from VR4More: '.$response->reason());
        }

        $data = $response->json();

        if (! isset($data['pois']) || ! is_array($data['pois'])) {
            Log::error('Invalid response structure from VR4More getPois', ['data' => $data]);

            throw new \Exception('Invalid response structure from VR4More');
        }

        return $data;
    }

    public function comparePois(Collection $evalveSceneObjects): array
    {
        // Fetch POIs from VR4More
        $vr4moreData = $this->getPois();
        $vr4morePois = collect($vr4moreData['pois']);

        // Convert Evalve SceneObjects to VR4More format for comparison
        $evalvePois = $evalveSceneObjects->map(function (SceneObject $sceneObject) {
            return [
                'name' => $sceneObject->name,
                'data' => PoiConverter::toVr4MorePoi($sceneObject),
            ];
        })->keyBy('name');

        // Key VR4More POIs by title for easy lookup
        $vr4moreByTitle = $vr4morePois->keyBy('title');

        // Categorize POIs
        $onlyInEvalve = [];
        $conflicts = [];
        $identical = [];

        // Check Evalve POIs
        foreach ($evalvePois as $name => $evalvePoi) {
            if (! $vr4moreByTitle->has($name)) {
                // POI only exists in Evalve
                $onlyInEvalve[] = [
                    'name' => $name,
                    'data' => $evalvePoi['data'],
                ];
            } else {
                // POI exists in both - compare
                $vr4morePoi = $vr4moreByTitle->get($name);
                $differences = $this->detectDifferences($evalvePoi['data'], $vr4morePoi);

                if (! empty($differences)) {
                    $conflicts[] = [
                        'name' => $name,
                        'evalve_data' => $evalvePoi['data'],
                        'vr4more_data' => $vr4morePoi,
                        'differences' => $differences,
                    ];
                } else {
                    $identical[] = $name;
                }
            }
        }

        // Check for POIs only in VR4More
        $onlyInVr4More = $vr4morePois->filter(function ($vr4morePoi) use ($evalvePois) {
            $title = $vr4morePoi['title'] ?? $vr4morePoi['poiId'] ?? null;

            return $title && ! $evalvePois->has($title);
        })->values()->toArray();

        return [
            'only_in_evalve' => $onlyInEvalve,
            'only_in_vr4more' => $onlyInVr4More,
            'conflicts' => $conflicts,
            'identical' => $identical,
        ];
    }

    public function pushPois(array $pois): Response
    {
        $accessToken = $this->getAccessToken();
        $sceneId = config('services.vr4more.scene_id');
        $body = json_encode(['pois' => $pois]);

        Log::info('Pushing POIs to VR4More', [
            'count' => count($pois),
            'scene_id' => $sceneId,
        ]);

        $response = Http::withBody($body)
            ->withHeaders(['Authorization' => "Token $accessToken"])
            ->post(config('services.vr4more.url')."/scenes/$sceneId/pois/reset/");

        if (! $response->successful()) {
            Log::error('Failed to push POIs to VR4More', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        } else {
            Log::info('Successfully pushed POIs to VR4More');
        }

        return $response;
    }

    private function getAccessToken(): string
    {
        return Cache::remember('vr4more_auth_token', 3600 * 6, function () {
            $user = config('services.vr4more.user');
            $password = config('services.vr4more.password');

            $response = Http::withBasicAuth($user, $password)
                ->post(config('services.vr4more.url').'/login/');

            if (! $response->successful()) {
                Log::error('Failed to authenticate with VR4More', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new \Exception('Failed to authenticate with VR4More: '.$response->reason());
            }

            $token = $response->json('accessToken');

            if (! $token) {
                Log::error('No accessToken in VR4More auth response', ['data' => $response->json()]);

                throw new \Exception('No access token received from VR4More');
            }

            return $token;
        });
    }

    private function detectDifferences(array $evalveData, array $vr4moreData): array
    {
        $differences = [];

        // Compare position
        if ($this->positionsDiffer($evalveData['position'] ?? [], $vr4moreData['position'] ?? [])) {
            $differences[] = 'position';
        }

        // Compare title
        if (($evalveData['title'] ?? '') !== ($vr4moreData['title'] ?? '')) {
            $differences[] = 'title';
        }

        // Compare dwellTime
        if ((($evalveData['dwellTime'] ?? -1) - ($vr4moreData['dwellTime'] ?? -1)) > 0.0001) {
            $differences[] = 'dwellTime ('.$evalveData['dwellTime'].'->'.$vr4moreData['dwellTime'].')';
        }

        // Compare order
        if (($evalveData['order'] ?? 0) !== ($vr4moreData['order'] ?? 0)) {
            $differences[] = 'order';
        }

        // Compare passthrough
        if (($evalveData['passthrough'] ?? 1) !== ($vr4moreData['passthrough'] ?? 1)) {
            $differences[] = 'passthrough';
        }

        // Compare transitions
        if (json_encode($evalveData['transitions'] ?? []) !== json_encode($vr4moreData['transitions'] ?? [])) {
            $differences[] = 'transitions';
        }

        // Compare poses (count and content)
        if ($this->posesDiffer($evalveData['poses'] ?? [], $vr4moreData['poses'] ?? [])) {
            $differences[] = 'poses';
        }

//         Skip imageUrl comparison - format differs between systems

        return $differences;
    }

    private function positionsDiffer(array $pos1, array $pos2): bool
    {
        $epsilon = 0.0001; // Tolerance for floating point comparison

        return abs(($pos1['x'] ?? 0) - ($pos2['x'] ?? 0)) > $epsilon
            || abs(($pos1['y'] ?? 0) - ($pos2['y'] ?? 0)) > $epsilon
            || abs(($pos1['z'] ?? 0) - ($pos2['z'] ?? 0)) > $epsilon;
    }

    private function posesDiffer(array $poses1, array $poses2): bool
    {
        // First check count
        if (count($poses1) !== count($poses2)) {
            return true;
        }

        // Sort both arrays by role for consistent comparison
        usort($poses1, fn ($a, $b) => strcmp($a['role'] ?? '', $b['role'] ?? ''));
        usort($poses2, fn ($a, $b) => strcmp($a['role'] ?? '', $b['role'] ?? ''));

        // Compare each pose
        foreach ($poses1 as $index => $pose1) {
            $pose2 = $poses2[$index] ?? [];

            // Compare role
            if (($pose1['role'] ?? '') !== ($pose2['role'] ?? '')) {
                return true;
            }

            // Compare position
            if ($this->positionsDiffer($pose1['position'] ?? [], $pose2['position'] ?? [])) {
                return true;
            }

            // Compare rotation
            if ($this->positionsDiffer($pose1['rotation'] ?? [], $pose2['rotation'] ?? [])) {
                return true;
            }

            // Compare scale
            $scale1 = $pose1['scale'] ?? 1;
            $scale2 = $pose2['scale'] ?? 1;
            if (abs($scale1 - $scale2) > 0.0001) {
                return true;
            }
        }

        return false;
    }
}
