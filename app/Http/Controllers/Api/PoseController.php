<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SceneObject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PoseController extends Controller
{
    /**
     * Get all poses for a scene object.
     */
    public function index(SceneObject $sceneObject, Request $request): JsonResponse
    {
        // Check if user has access to this scene object's team
        if (! $this->userHasAccessToSceneObject($request->user(), $sceneObject)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to scene object',
            ], 403);
        }

        try {
            $poses = collect($sceneObject->properties ?? [])
                ->filter(fn (array $property): bool => ($property['type'] ?? null) === 'pose')
                ->values()
                ->map(fn (array $property): array => $property['data'])
                ->toArray();

            return response()->json([
                'success' => true,
                'message' => 'Poses retrieved successfully',
                'data' => $poses,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve poses: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add a new pose to a scene object.
     */
    public function store(SceneObject $sceneObject, Request $request): JsonResponse
    {
        // Check if user has access to this scene object's team
        if (! $this->userHasAccessToSceneObject($request->user(), $sceneObject)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to scene object',
            ], 403);
        }

        $validated = $request->validate([
            'role' => 'required|string|in:Default,Default-HMD',
            'position' => 'required|array',
            'position.x' => 'required|numeric',
            'position.y' => 'required|numeric',
            'position.z' => 'required|numeric',
            'rotation' => 'required|array',
            'rotation.x' => 'required|numeric',
            'rotation.y' => 'required|numeric',
            'rotation.z' => 'required|numeric',
        ]);

        try {
            $currentProperties = $sceneObject->properties ?? [];

            // Generate UUID for the new pose
            $poseId = Str::uuid()->toString();
            $poseData = array_merge(['id' => $poseId], $validated);

            // Add new pose to properties array
            $newPose = [
                'type' => 'pose',
                'data' => $poseData,
            ];

            $currentProperties[] = $newPose;

            $sceneObject->update([
                'properties' => $currentProperties,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pose added successfully',
                'data' => $poseData,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add pose: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a specific pose by UUID.
     */
    public function update(SceneObject $sceneObject, string $uuid, Request $request): JsonResponse
    {
        // Check if user has access to this scene object's team
        if (! $this->userHasAccessToSceneObject($request->user(), $sceneObject)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to scene object',
            ], 403);
        }

        // Validate UUID format
        if (! Str::isUuid($uuid)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid UUID format',
            ], 400);
        }

        $validated = $request->validate([
            'role' => 'sometimes|required|string|in:Default,Default-HMD',
            'position' => 'sometimes|required|array',
            'position.x' => 'sometimes|required|numeric',
            'position.y' => 'sometimes|required|numeric',
            'position.z' => 'sometimes|required|numeric',
            'rotation' => 'sometimes|required|array',
            'rotation.x' => 'sometimes|required|numeric',
            'rotation.y' => 'sometimes|required|numeric',
            'rotation.z' => 'sometimes|required|numeric',
        ]);

        try {
            $currentProperties = $sceneObject->properties ?? [];

            // Find pose by UUID
            $poseIndex = null;
            foreach ($currentProperties as $i => $property) {
                if (($property['type'] ?? null) === 'pose' &&
                    ($property['data']['id'] ?? null) === $uuid) {
                    $poseIndex = $i;
                    break;
                }
            }

            // Check if the pose exists
            if ($poseIndex === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pose not found with UUID '.$uuid,
                ], 404);
            }

            // Merge updated data with existing pose data
            $currentPoseData = $currentProperties[$poseIndex]['data'];
            $updatedPoseData = array_merge($currentPoseData, $validated);

            $currentProperties[$poseIndex]['data'] = $updatedPoseData;

            $sceneObject->update([
                'properties' => $currentProperties,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pose updated successfully',
                'data' => $updatedPoseData,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update pose: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a specific pose by UUID.
     */
    public function destroy(SceneObject $sceneObject, string $uuid, Request $request): JsonResponse
    {
        // Check if user has access to this scene object's team
        if (! $this->userHasAccessToSceneObject($request->user(), $sceneObject)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to scene object',
            ], 403);
        }

        // Validate UUID format
        if (! Str::isUuid($uuid)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid UUID format',
            ], 400);
        }

        try {
            $currentProperties = $sceneObject->properties ?? [];

            // Find pose by UUID
            $poseIndex = null;
            foreach ($currentProperties as $i => $property) {
                if (($property['type'] ?? null) === 'pose' &&
                    ($property['data']['id'] ?? null) === $uuid) {
                    $poseIndex = $i;
                    break;
                }
            }

            // Check if the pose exists
            if ($poseIndex === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pose not found with UUID '.$uuid,
                ], 404);
            }

            // Remove the pose from properties
            array_splice($currentProperties, $poseIndex, 1);

            $sceneObject->update([
                'properties' => $currentProperties,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pose deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete pose: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check if user has access to the scene object's team.
     */
    private function userHasAccessToSceneObject($user, SceneObject $sceneObject): bool
    {
        if (! $user) {
            return false;
        }

        return $user->teams()->where('teams.id', $sceneObject->team_id)->exists();
    }
}
