<?php

namespace Tests\Unit\Filament\Pages\ParticipantView\Factories;

use App\Filament\Pages\ParticipantView\Factories\QuestionFieldFactory;
use App\Models\Question;
use InvalidArgumentException;
use Tests\TestCase;

class QuestionFieldFactoryTest extends TestCase
{
    public function test_it_returns_empty_array_for_null_question(): void
    {
        $fields = QuestionFieldFactory::make(null);

        $this->assertEquals([], $fields);
    }

    public function test_it_creates_semantic_differential_fields(): void
    {
        $question = new Question([
            'id' => '01JBRJ3XTEST000000000001',
            'text' => 'Test Question',
            'type' => 'semantic_differential',
            'properties' => [
                'size' => 5,
                'items' => [
                    ['label_a' => 'Good', 'label_b' => 'Bad'],
                    ['label_a' => 'Fast', 'label_b' => 'Slow'],
                ],
            ],
        ]);

        $fields = QuestionFieldFactory::make($question);

        $this->assertIsArray($fields);
        $this->assertCount(2, $fields);
    }

    public function test_it_creates_single_choice_fields(): void
    {
        $question = new Question([
            'id' => '01JBRJ3XTEST000000000002',
            'text' => 'Test Question',
            'type' => 'single_choice',
            'properties' => [
                'options' => [
                    ['option' => 'Option 1'],
                    ['option' => 'Option 2'],
                    ['option' => 'Option 3'],
                ],
            ],
        ]);

        $fields = QuestionFieldFactory::make($question);

        $this->assertIsArray($fields);
        $this->assertCount(1, $fields);
    }

    public function test_it_creates_multiple_choice_fields(): void
    {
        $question = new Question([
            'id' => '01JBRJ3XTEST000000000003',
            'text' => 'Test Question',
            'type' => 'multiple_choice',
            'properties' => [
                'options' => [
                    ['option' => 'Option A'],
                    ['option' => 'Option B'],
                    ['option' => 'Option C'],
                ],
            ],
        ]);

        $fields = QuestionFieldFactory::make($question);

        $this->assertIsArray($fields);
        $this->assertCount(1, $fields);
    }

    public function test_it_throws_exception_for_unknown_question_type(): void
    {
        $question = new Question([
            'id' => '01JBRJ3XTEST000000000004',
            'text' => 'Test Question',
            'type' => 'unknown_type',
            'properties' => [],
        ]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Unknown question type: unknown_type');

        QuestionFieldFactory::make($question);
    }

    public function test_it_returns_supported_types(): void
    {
        $types = QuestionFieldFactory::getSupportedTypes();

        $this->assertEquals([
            'semantic_differential',
            'single_choice',
            'multiple_choice',
            'image'
        ], $types);
    }
}
