<?php

namespace Tests\Unit\Filament\Pages\ParticipantView\ValueObjects;

use App\Filament\Pages\ParticipantView\ValueObjects\ResponseData;
use App\Models\Question;
use Tests\TestCase;

class ResponseDataTest extends TestCase
{
    public function test_it_can_be_instantiated_directly(): void
    {
        $data = new ResponseData(
            questionId: '01JBRJ3XTEST000000000001',
            questionType: 'single_choice',
            data: ['response' => 0]
        );

        $this->assertEquals('01JBRJ3XTEST000000000001', $data->questionId);
        $this->assertEquals('single_choice', $data->questionType);
        $this->assertEquals(['response' => 0], $data->data);
    }

    public function test_it_can_be_created_from_form_data(): void
    {
        $question = new Question([
            'id' => '01JBRJ3XTEST000000000002',
            'type' => 'multiple_choice',
        ]);

        $formData = ['response' => [0, 2]];

        $data = ResponseData::fromFormData($question, $formData);

        $this->assertEquals('01JBRJ3XTEST000000000002', $data->questionId);
        $this->assertEquals('multiple_choice', $data->questionType);
        $this->assertEquals(['response' => [0, 2]], $data->data);
    }

    public function test_it_converts_to_array(): void
    {
        $data = new ResponseData(
            questionId: '01JBRJ3XTEST000000000003',
            questionType: 'semantic_differential',
            data: ['item_0' => 3, 'item_1' => 5]
        );

        $array = $data->toArray();

        $this->assertEquals([
            'question_id' => '01JBRJ3XTEST000000000003',
            'question_type' => 'semantic_differential',
            'response_data' => ['item_0' => 3, 'item_1' => 5],
        ], $array);
    }

    public function test_properties_are_readonly(): void
    {
        $data = new ResponseData(
            questionId: '01JBRJ3XTEST000000000004',
            questionType: 'single_choice',
            data: ['response' => 1]
        );

        $this->expectException(\Error::class);
        $data->questionId = '01JBRJ3XTEST000000000005';
    }
}
