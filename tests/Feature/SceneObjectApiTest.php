<?php

namespace Tests\Feature;

/**
 * SceneObject API Tests
 *
 * Tests for the POI (SceneObject) API endpoints that allow third-party applications
 * to modify POI position/rotation and thumbnails.
 *
 * Tested Endpoints:
 * - PATCH /api/v1/scene-objects/{id}/transform - Update position/rotation
 * - PATCH /api/v1/scene-objects/{id}/thumbnail - Update thumbnail image
 *
 * Requirements:
 * - PHP PDO extension (pdo_sqlite or pdo_mysql)
 * - Run: php artisan test --filter=SceneObjectApiTest
 *
 * Note: Tests will be skipped if no database driver is available.
 */

use App\Models\SceneObject;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SceneObjectApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Team $team;

    protected function setUp(): void
    {
        // Skip tests if database connection is not available
        if (! extension_loaded('pdo_sqlite') && ! extension_loaded('pdo_mysql')) {
            $this->markTestSkipped('No database driver available for testing. Install pdo_sqlite or pdo_mysql extension.');
        }

        parent::setUp();

        // Create a user and team for testing
        $this->user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $this->team = Team::create(['name' => 'Test Team']);
        $this->user->teams()->attach($this->team);
    }

    public function test_can_update_scene_object_transform(): void
    {
        // Create a scene object with initial transform
        $sceneObject = SceneObject::create([
            'team_id' => $this->team->id,
            'name' => 'Test POI',
            'transform' => [
                'position' => ['x' => 0, 'y' => 0, 'z' => 0],
                'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
            ],
        ]);

        // Update transform with new position
        $response = $this->actingAs($this->user)
            ->withHeader('Accept', 'application/json')
            ->patchJson("/api/v1/scene-objects/{$sceneObject->id}/transform", [
                'transform' => [
                    'position' => ['x' => 10, 'y' => 5, 'z' => 3],
                ],
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Transform updated successfully',
            ]);

        // Verify transform was updated
        $sceneObject->refresh();
        $this->assertEquals(10, $sceneObject->transform['position']['x']);
        $this->assertEquals(5, $sceneObject->transform['position']['y']);
        $this->assertEquals(3, $sceneObject->transform['position']['z']);

        // Verify rotation and scale were preserved
        $this->assertEquals(0, $sceneObject->transform['rotation']['x']);
    }

    public function test_can_partially_update_transform(): void
    {
        // Create a scene object
        $sceneObject = SceneObject::create([
            'team_id' => $this->team->id,
            'name' => 'Test POI',
            'transform' => [
                'position' => ['x' => 1, 'y' => 2, 'z' => 3],
                'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
            ],
        ]);

        // Update only rotation
        $response = $this->actingAs($this->user)
            ->withHeader('Accept', 'application/json')
            ->patchJson("/api/v1/scene-objects/{$sceneObject->id}/transform", [
                'transform' => [
                    'rotation' => ['x' => 0.5, 'y' => 0.5, 'z' => 0.5],
                ],
            ]);

        $response->assertStatus(200);

        // Verify only rotation was updated, position preserved
        $sceneObject->refresh();
        $this->assertEquals(1, $sceneObject->transform['position']['x']);
        $this->assertEquals(0.5, $sceneObject->transform['rotation']['x']);
    }

    public function test_transform_update_validates_input(): void
    {
        $sceneObject = SceneObject::create([
            'team_id' => $this->team->id,
            'name' => 'Test POI',
        ]);

        // Authenticate user
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $token = $response->json('token');

        // Send invalid data (missing transform key)
        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson("/api/v1/scene-objects/{$sceneObject->id}/transform", [
                'position' => ['x' => 10],
            ]);

        $response->assertStatus(422);
    }

    public function test_can_upload_and_save_thumbnail(): void
    {
        Storage::fake('public');

        $sceneObject = SceneObject::create([
            'team_id' => $this->team->id,
            'name' => 'Test POI',
        ]);

        // Create a fake image
        $file = UploadedFile::fake()->image('thumbnail.jpg', 100, 100);

        // Upload thumbnail using PATCH
        $response = $this->actingAs($this->user)
            ->withHeader('Accept', 'application/json')
            ->patch("/api/v1/scene-objects/{$sceneObject->id}/thumbnail", [
                'thumbnail' => $file,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Thumbnail uploaded successfully',
            ]);

        // Verify file was stored
        $this->assertTrue(Storage::disk('public')->exists($response->json('data.imageUrl')));

        // Verify imageUrl was saved to database
        $sceneObject->refresh();
        $this->assertNotNull($sceneObject->imageUrl);
        $this->assertStringContainsString('thumbnails/', $sceneObject->imageUrl);
    }

    public function test_thumbnail_upload_requires_valid_image(): void
    {
        $sceneObject = SceneObject::create([
            'team_id' => $this->team->id,
            'name' => 'Test POI',
        ]);

        // Try to upload a non-image file
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this->actingAs($this->user)
            ->withHeader('Accept', 'application/json')
            ->patch("/api/v1/scene-objects/{$sceneObject->id}/thumbnail", [
                'thumbnail' => $file,
            ]);

        $response->assertStatus(422);
    }

    public function test_endpoints_require_authentication(): void
    {
        $sceneObject = SceneObject::create([
            'team_id' => $this->team->id,
            'name' => 'Test POI',
        ]);

        // Try to update transform without authentication
        $response = $this->patchJson("/api/v1/scene-objects/{$sceneObject->id}/transform", [
            'transform' => ['position' => ['x' => 10]],
        ]);

        $response->assertStatus(401);

        // Try to upload thumbnail without authentication
        $response = $this->withHeaders([
            'Accept' => 'application/json',
        ])->patch("/api/v1/scene-objects/{$sceneObject->id}/thumbnail", [
            'thumbnail' => UploadedFile::fake()->image('test.jpg'),
        ]);

        $response->assertStatus(401);
    }
}
