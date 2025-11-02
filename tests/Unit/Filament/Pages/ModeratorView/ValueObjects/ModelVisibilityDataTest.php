<?php

namespace Tests\Unit\Filament\Pages\ModeratorView\ValueObjects;

use App\Evalve\SceneObjectSettings;
use App\Filament\Pages\ModeratorView\ValueObjects\ModelVisibilityData;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ModelVisibilityDataTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Mock SceneObjectSettings data
        Storage::fake('local');
        Cache::flush();
    }

    public function test_it_can_be_instantiated_directly(): void
    {
        $models = ['Model1', 'Model2'];
        $data = new ModelVisibilityData($models);

        $this->assertEquals($models, $data->selectedModels);
    }

    public function test_it_can_be_created_from_models_array(): void
    {
        $models = ['Model1', 'Model2', 'Model3'];
        $data = ModelVisibilityData::fromModels($models);

        $this->assertInstanceOf(ModelVisibilityData::class, $data);
        $this->assertEquals($models, $data->selectedModels);
    }

    public function test_from_models_handles_empty_array(): void
    {
        $data = ModelVisibilityData::fromModels([]);

        $this->assertEquals([], $data->selectedModels);
    }

    public function test_selected_models_property_is_readonly(): void
    {
        $data = new ModelVisibilityData(['Model1']);

        $this->expectException(\Error::class);
        $data->selectedModels = ['Model2'];
    }

    public function test_as_string_returns_correct_format_with_selected_models(): void
    {
        $this->setupSceneObjectSettings([
            'modelGroups' => [
                ['name' => 'Model1'],
                ['name' => 'Model2'],
                ['name' => 'Model3'],
            ],
        ]);

        $data = ModelVisibilityData::fromModels(['Model1', 'Model3']);
        $result = $data->asString();

        $this->assertEquals('+Model1,-Model2,+Model3', $result);
    }

    public function test_as_string_returns_all_minus_when_no_models_selected(): void
    {
        $this->setupSceneObjectSettings([
            'modelGroups' => [
                ['name' => 'Model1'],
                ['name' => 'Model2'],
            ],
        ]);

        $data = ModelVisibilityData::fromModels([]);
        $result = $data->asString();

        $this->assertEquals('-Model1,-Model2', $result);
    }

    public function test_as_string_returns_all_plus_when_all_models_selected(): void
    {
        $this->setupSceneObjectSettings([
            'modelGroups' => [
                ['name' => 'Model1'],
                ['name' => 'Model2'],
                ['name' => 'Model3'],
            ],
        ]);

        $data = ModelVisibilityData::fromModels(['Model1', 'Model2', 'Model3']);
        $result = $data->asString();

        $this->assertEquals('+Model1,+Model2,+Model3', $result);
    }

    public function test_as_toggle_string_returns_correct_format_with_selected_models(): void
    {
        $allGroups = ['Group1', 'Group2', 'Group3', 'Group4'];
        $data = ModelVisibilityData::fromModels(['Group1', 'Group3']);
        $result = $data->asToggleString($allGroups);

        $this->assertEquals('+Group1,-Group2,+Group3,-Group4', $result);
    }

    public function test_as_toggle_string_handles_empty_selected_models(): void
    {
        $allGroups = ['Group1', 'Group2'];
        $data = ModelVisibilityData::fromModels([]);
        $result = $data->asToggleString($allGroups);

        $this->assertEquals('-Group1,-Group2', $result);
    }

    public function test_as_toggle_string_handles_empty_all_groups(): void
    {
        $data = ModelVisibilityData::fromModels(['Model1']);
        $result = $data->asToggleString([]);

        $this->assertEquals('', $result);
    }

    public function test_as_toggle_string_handles_all_selected(): void
    {
        $allGroups = ['A', 'B', 'C'];
        $data = ModelVisibilityData::fromModels(['A', 'B', 'C']);
        $result = $data->asToggleString($allGroups);

        $this->assertEquals('+A,+B,+C', $result);
    }

    public function test_as_toggle_string_maintains_order_of_all_groups(): void
    {
        $allGroups = ['Zebra', 'Apple', 'Banana'];
        $data = ModelVisibilityData::fromModels(['Banana']);
        $result = $data->asToggleString($allGroups);

        $this->assertEquals('-Zebra,-Apple,+Banana', $result);
    }

    public function test_as_toggle_string_ignores_selected_models_not_in_all_groups(): void
    {
        $allGroups = ['Group1', 'Group2'];
        $data = ModelVisibilityData::fromModels(['Group1', 'NonExistent']);
        $result = $data->asToggleString($allGroups);

        $this->assertEquals('+Group1,-Group2', $result);
    }

    public function test_as_toggle_string_is_case_sensitive(): void
    {
        $allGroups = ['model1', 'Model1'];
        $data = ModelVisibilityData::fromModels(['model1']);
        $result = $data->asToggleString($allGroups);

        $this->assertEquals('+model1,-Model1', $result);
    }

    public function test_as_string_and_as_toggle_string_produce_same_format_when_groups_match(): void
    {
        $this->setupSceneObjectSettings([
            'modelGroups' => [
                ['name' => 'A'],
                ['name' => 'B'],
            ],
        ]);

        $data = ModelVisibilityData::fromModels(['A']);
        $asString = $data->asString();
        $asToggleString = $data->asToggleString(['A', 'B']);

        $this->assertEquals($asString, $asToggleString);
    }

    public function test_it_handles_models_with_special_characters(): void
    {
        $allGroups = ['Model-1', 'Model_2', 'Model 3'];
        $data = ModelVisibilityData::fromModels(['Model-1', 'Model 3']);
        $result = $data->asToggleString($allGroups);

        $this->assertEquals('+Model-1,-Model_2,+Model 3', $result);
    }

    public function test_from_models_preserves_array_values(): void
    {
        $models = ['A' => 'Model1', 'B' => 'Model2'];
        $data = ModelVisibilityData::fromModels($models);

        // Should preserve values even with keys
        $this->assertContains('Model1', $data->selectedModels);
        $this->assertContains('Model2', $data->selectedModels);
    }

    private function setupSceneObjectSettings(array $settings): void
    {
        Storage::disk('local')->put('soSettings.json', json_encode($settings));
        Cache::forget('soSettings');
    }
}
