<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', function (Request $request) {
    $credentials = $request->only('email', 'password');

    if (! Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid login details.'], 401);
    }

    $user = Auth::user();
    $token = $user->createToken('unity-client')->plainTextToken;

    return response()->json([
        'token' => $token,
        'email' => $user->email,
    ]);
});

Route::post('/logout', function (Request $request) {
    $request->user()->tokens()->delete();

    return response()->json(['message' => 'Logged out.']);
})->middleware('auth:sanctum');

Route::group(['prefix' => '/v1', 'middleware' => 'auth:sanctum'], function () {
    Route::get('/teams', function (Request $request) {
        return $request->user()->teams;
    });

    Route::get('/asset-bundles/{id}', function (string $id) {
        return new \App\Http\Resources\AssetResource(\App\Models\Asset::find($id));
    });

    Route::get('/asset-bundles', function () {
        return \App\Models\Asset::all()->toResourceCollection();
    });

    Route::post('/scene-objects/{sceneObject}/thumbnail', \App\Http\Controllers\Api\ThumbnailController::class);
    Route::patch('/scene-objects/{sceneObject}/thumbnail', \App\Http\Controllers\Api\ThumbnailController::class);
    Route::patch('/scene-objects/{sceneObject}/transform', \App\Http\Controllers\Api\TransformController::class);

    Route::get('/scene-objects/{sceneObject}', function (\App\Models\SceneObject $sceneObject) {
        return $sceneObject;
    });

    Route::post('/scene-objects', function (Request $request) {
        return \App\Models\SceneObject::create($request->except(['id']));
    });

    Route::put('/scene-objects/{sceneObject}', function (\App\Models\SceneObject $sceneObject, Request $request) {
        $sceneObject->update($request->except(['id']));

        return $sceneObject->refresh();
    });

    Route::delete('/scene-objects/{sceneObject}', function (\App\Models\SceneObject $sceneObject) {
        $sceneObject->delete();

        return ['message' => 'Deleted'];
    });

    Route::get('/scene-objects', function () {
        return \App\Models\SceneObject::all();
    });

    Route::get('/teams/{team}/scene-objects', function (\App\Models\Team $team) {
        return $team->sceneObjects;
    });

    Route::get('/teams/{team}/asset-bundles', function (\App\Models\Team $team) {
        return $team->assetBundles->toResourceCollection();
    });
});
