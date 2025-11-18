<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SceneObject;
use Illuminate\Http\Request;

class TransformController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(SceneObject $sceneObject, Request $request): \Illuminate\Http\JsonResponse
    {
        // Validate the incoming request
        $request->validate([
            'transform' => 'required|array',
            'transform.position' => 'sometimes|array',
            'transform.position.x' => 'sometimes|numeric',
            'transform.position.y' => 'sometimes|numeric',
            'transform.position.z' => 'sometimes|numeric',
            'transform.rotation' => 'sometimes|array',
            'transform.rotation.x' => 'sometimes|numeric',
            'transform.rotation.y' => 'sometimes|numeric',
            'transform.rotation.z' => 'sometimes|numeric',
        ]);

        try {
            // Get current transform or initialize empty array
            $currentTransform = $sceneObject->transform ?? [];

            // Merge the new transform data with existing data
            $updatedTransform = array_merge($currentTransform, $request->input('transform'));

            // Update the scene object
            $sceneObject->update([
                'transform' => $updatedTransform,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Transform updated successfully',
                'data' => $sceneObject->refresh(),
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update transform: '.$e->getMessage(),
            ], 500);
        }
    }
}
