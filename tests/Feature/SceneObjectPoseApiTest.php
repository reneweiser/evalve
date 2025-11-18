<?php

namespace Tests\Feature;

use App\Models\SceneObject;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SceneObjectPoseApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Team $team;

    private SceneObject $sceneObject;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a user and team
        $this->user = User::factory()->create();
        $this->team = Team::factory()->create();
        $this->user->teams()->attach($this->team);

        // Create a scene object with some initial properties
        $this->sceneObject = SceneObject::create([
            'name' => 'Test Scene Object',
            'team_id' => $this->team->id,
            'transform' => [
                'position' => ['x' => 0.0, 'y' => 0.0, 'z' => 0.0],
                'rotation' => ['x' => 0.0, 'y' => 0.0, 'z' => 0.0],
            ],
            'properties' => [
                [
                    'type' => 'pose',
                    'data' => [
                        'id' => '01234567-89ab-cdef-0123-456789abcdef',
                        'role' => 'Default',
                        'position' => ['x' => 1.0, 'y' => 2.0, 'z' => 3.0],
                        'rotation' => ['x' => 0.0, 'y' => 90.0, 'z' => 0.0],
                    ],
                ],
                [
                    'type' => 'notes',
                    'data' => ['notes' => 'Test notes'],
                ],
                [
                    'type' => 'pose',
                    'data' => [
                        'id' => 'abc42a0d-3c61-4175-b23d-fd8266187067',
                        'role' => 'Default-HMD',
                        'position' => ['x' => 5.0, 'y' => 6.0, 'z' => 7.0],
                        'rotation' => ['x' => 45.0, 'y' => 0.0, 'z' => 0.0],
                    ],
                ],
            ],
        ]);

        // Authenticate user
        Sanctum::actingAs($this->user);
    }

    public function test_can_get_all_poses_from_scene_object(): void
    {
        $response = $this->getJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Poses retrieved successfully',
            ])
            ->assertJsonCount(2, 'data');

        $poses = $response->json('data');

        $this->assertArrayHasKey('id', $poses[0]);
        $this->assertEquals('01234567-89ab-cdef-0123-456789abcdef', $poses[0]['id']);
        $this->assertEquals('Default', $poses[0]['role']);
        $this->assertEquals(['x' => 1.0, 'y' => 2.0, 'z' => 3.0], $poses[0]['position']);

        $this->assertArrayHasKey('id', $poses[1]);
        $this->assertEquals('abc42a0d-3c61-4175-b23d-fd8266187067', $poses[1]['id']);
        $this->assertEquals('Default-HMD', $poses[1]['role']);
        $this->assertEquals(['x' => 5.0, 'y' => 6.0, 'z' => 7.0], $poses[1]['position']);
    }

    public function test_can_get_poses_from_scene_object_with_no_poses(): void
    {
        $emptySceneObject = SceneObject::create([
            'name' => 'Empty Scene Object',
            'team_id' => $this->team->id,
            'transform' => [
                'position' => ['x' => 0.0, 'y' => 0.0, 'z' => 0.0],
                'rotation' => ['x' => 0.0, 'y' => 0.0, 'z' => 0.0],
            ],
            'properties' => [],
        ]);

        $response = $this->getJson("/api/v1/scene-objects/{$emptySceneObject->id}/poses");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [],
            ]);
    }

    public function test_can_add_new_pose_with_valid_data(): void
    {
        $newPose = [
            'role' => 'Default',
            'position' => ['x' => 10.0, 'y' => 11.0, 'z' => 12.0],
            'rotation' => ['x' => 30.0, 'y' => 60.0, 'z' => 90.0],
        ];

        $response = $this->postJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses", $newPose);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Pose added successfully',
                'data' => [
                    ...$newPose,
                ],
            ]);

        // Verify UUID exists and is valid
        $responseData = $response->json('data');
        $this->assertArrayHasKey('id', $responseData);
        $this->assertTrue(\Illuminate\Support\Str::isUuid($responseData['id']));

        // Verify pose was added to database
        $this->sceneObject->refresh();
        $poses = collect($this->sceneObject->properties)
            ->filter(fn ($prop) => $prop['type'] === 'pose')
            ->values();

        $this->assertCount(3, $poses);
        $this->assertEquals($newPose['role'], $poses[2]['data']['role']);
        $this->assertEquals($newPose['position'], $poses[2]['data']['position']);
        $this->assertEquals($newPose['rotation'], $poses[2]['data']['rotation']);
    }

    public function test_rejects_pose_with_invalid_role(): void
    {
        $invalidPose = [
            'role' => 'InvalidRole',
            'position' => ['x' => 10.0, 'y' => 11.0, 'z' => 12.0],
            'rotation' => ['x' => 30.0, 'y' => 60.0, 'z' => 90.0],
        ];

        $response = $this->postJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses", $invalidPose);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['role']);
    }

    public function test_rejects_pose_with_missing_position_fields(): void
    {
        $invalidPose = [
            'role' => 'Default',
            'position' => ['x' => 10.0, 'y' => 11.0], // Missing z
            'rotation' => ['x' => 30.0, 'y' => 60.0, 'z' => 90.0],
        ];

        $response = $this->postJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses", $invalidPose);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['position.z']);
    }

    public function test_rejects_pose_with_missing_rotation_fields(): void
    {
        $invalidPose = [
            'role' => 'Default',
            'position' => ['x' => 10.0, 'y' => 11.0, 'z' => 12.0],
            'rotation' => ['x' => 30.0], // Missing y and z
        ];

        $response = $this->postJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses", $invalidPose);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['rotation.y', 'rotation.z']);
    }

    public function test_rejects_pose_with_non_numeric_position(): void
    {
        $invalidPose = [
            'role' => 'Default',
            'position' => ['x' => 'not a number', 'y' => 11.0, 'z' => 12.0],
            'rotation' => ['x' => 30.0, 'y' => 60.0, 'z' => 90.0],
        ];

        $response = $this->postJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses", $invalidPose);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['position.x']);
    }

    public function test_can_update_existing_pose_by_uuid(): void
    {
        $updates = [
            'position' => ['x' => 100.0, 'y' => 200.0, 'z' => 300.0],
        ];

        $uuid = '01234567-89ab-cdef-0123-456789abcdef';
        $response = $this->patchJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses/{$uuid}", $updates);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Pose updated successfully',
                'data' => [
                    'id' => $uuid,
                    'role' => 'Default', // Should remain unchanged
                    'position' => ['x' => 100.0, 'y' => 200.0, 'z' => 300.0],
                    'rotation' => ['x' => 0.0, 'y' => 90.0, 'z' => 0.0], // Should remain unchanged
                ],
            ]);

        // Verify update in database
        $this->sceneObject->refresh();
        $poses = collect($this->sceneObject->properties)
            ->filter(fn ($prop) => $prop['type'] === 'pose')
            ->values();

        $this->assertEquals(['x' => 100.0, 'y' => 200.0, 'z' => 300.0], $poses[0]['data']['position']);
        $this->assertEquals('Default', $poses[0]['data']['role']);
    }

    public function test_can_update_pose_role_only(): void
    {
        $updates = [
            'role' => 'Default-HMD',
        ];

        $uuid = '01234567-89ab-cdef-0123-456789abcdef';
        $response = $this->patchJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses/{$uuid}", $updates);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $uuid,
                    'role' => 'Default-HMD',
                    'position' => ['x' => 1.0, 'y' => 2.0, 'z' => 3.0], // Should remain unchanged
                ],
            ]);
    }

    public function test_returns_404_when_updating_non_existent_pose_uuid(): void
    {
        $updates = [
            'position' => ['x' => 100.0, 'y' => 200.0, 'z' => 300.0],
        ];

        $nonExistentUuid = '99999999-9999-9999-9999-999999999999';
        $response = $this->patchJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses/{$nonExistentUuid}", $updates);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Pose not found with UUID '.$nonExistentUuid,
            ]);
    }

    public function test_can_delete_pose_by_uuid(): void
    {
        $uuid = '01234567-89ab-cdef-0123-456789abcdef';
        $response = $this->deleteJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses/{$uuid}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Pose deleted successfully',
            ]);

        // Verify pose was deleted and other properties remain
        $this->sceneObject->refresh();
        $properties = $this->sceneObject->properties;

        $poses = collect($properties)
            ->filter(fn ($prop) => $prop['type'] === 'pose')
            ->values();

        $this->assertCount(1, $poses);
        $this->assertEquals('Default-HMD', $poses[0]['data']['role']);

        // Verify notes property still exists
        $notes = collect($properties)
            ->filter(fn ($prop) => $prop['type'] === 'notes')
            ->values();

        $this->assertCount(1, $notes);
    }

    public function test_returns_404_when_deleting_non_existent_pose_uuid(): void
    {
        $nonExistentUuid = '99999999-9999-9999-9999-999999999999';
        $response = $this->deleteJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses/{$nonExistentUuid}");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Pose not found with UUID '.$nonExistentUuid,
            ]);
    }

    public function test_other_properties_remain_unchanged_after_pose_operations(): void
    {
        // Add a new pose
        $this->postJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses", [
            'role' => 'Default',
            'position' => ['x' => 1.0, 'y' => 1.0, 'z' => 1.0],
            'rotation' => ['x' => 0.0, 'y' => 0.0, 'z' => 0.0],
        ]);

        $this->sceneObject->refresh();

        // Verify notes property still exists
        $notes = collect($this->sceneObject->properties)
            ->filter(fn ($prop) => $prop['type'] === 'notes')
            ->values();

        $this->assertCount(1, $notes);
        $this->assertEquals('Test notes', $notes[0]['data']['notes']);
    }

    public function test_requires_authentication(): void
    {
        // Remove authentication
        $this->app->get('auth')->forgetGuards();

        $response = $this->getJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses");

        $response->assertStatus(401);
    }

    public function test_cannot_access_other_teams_scene_objects(): void
    {
        // Create another team and scene object
        $otherTeam = Team::factory()->create();
        $otherSceneObject = SceneObject::create([
            'name' => 'Other Team Scene Object',
            'team_id' => $otherTeam->id,
            'transform' => [
                'position' => ['x' => 0.0, 'y' => 0.0, 'z' => 0.0],
                'rotation' => ['x' => 0.0, 'y' => 0.0, 'z' => 0.0],
            ],
            'properties' => [
                [
                    'type' => 'pose',
                    'data' => [
                        'role' => 'Default',
                        'position' => ['x' => 1.0, 'y' => 2.0, 'z' => 3.0],
                        'rotation' => ['x' => 0.0, 'y' => 90.0, 'z' => 0.0],
                    ],
                ],
            ],
        ]);

        // Try to access other team's scene object
        $response = $this->getJson("/api/v1/scene-objects/{$otherSceneObject->id}/poses");

        // This should return 403 forbidden because user doesn't belong to the scene object's team
        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Unauthorized access to scene object',
            ]);
    }

    public function test_can_handle_scene_object_with_null_properties(): void
    {
        $sceneObject = SceneObject::create([
            'name' => 'Null Properties Scene Object',
            'team_id' => $this->team->id,
            'transform' => [
                'position' => ['x' => 0.0, 'y' => 0.0, 'z' => 0.0],
                'rotation' => ['x' => 0.0, 'y' => 0.0, 'z' => 0.0],
            ],
            'properties' => null,
        ]);

        $response = $this->getJson("/api/v1/scene-objects/{$sceneObject->id}/poses");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [],
            ]);
    }

    public function test_returns_400_when_updating_with_invalid_uuid_format(): void
    {
        $invalidUuid = 'not-a-valid-uuid';
        $response = $this->patchJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses/{$invalidUuid}", [
            'role' => 'Default',
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid UUID format',
            ]);
    }

    public function test_returns_400_when_deleting_with_invalid_uuid_format(): void
    {
        $invalidUuid = 'not-a-valid-uuid';
        $response = $this->deleteJson("/api/v1/scene-objects/{$this->sceneObject->id}/poses/{$invalidUuid}");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid UUID format',
            ]);
    }
}
