<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SceneObject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ThumbnailController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(SceneObject $sceneObject, Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif|max:16384', // Max 16MB
        ]);

        try {
            // Check if file is present
            if ($request->hasFile('thumbnail')) {
                $file = $request->file('thumbnail');

                // Generate unique filename
                $filename = Str::random(40).'.'.$file->getClientOriginalExtension();

                // Store the file in storage/app/public/thumbnails
                $path = $file->storeAs('thumbnails', $filename, 'public');

                // Update the scene object's imageUrl
                $sceneObject->update([
                    'imageUrl' => $path,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Thumbnail uploaded successfully',
                    'data' => $sceneObject->refresh(),
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'No thumbnail file provided',
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload thumbnail: '.$e->getMessage(),
            ], 500);
        }
    }
}
