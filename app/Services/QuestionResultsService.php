<?php

namespace App\Services;

use App\Models\Question;
use App\Models\QuestionResponse;
use Illuminate\Support\Collection;

class QuestionResultsService
{
    public function aggregateResults(Question $question): array
    {
        $session = request()->query('sessionName');
        $responses = QuestionResponse::where('question_id', $question->id)
            ->where('session_id', $session)
            ->whereNotNull('submitted_at')
            ->get();

        return match ($question->type) {
            'single_choice' => $this->aggregateSingleChoice($question, $responses),
            'multiple_choice' => $this->aggregateMultipleChoice($question, $responses),
            'semantic_differential' => $this->aggregateSemanticDifferential($question, $responses),
            'image' => $this->aggregateImage($question, $responses),
            default => ['error' => 'Unknown question type']
        };
    }

    private function aggregateSingleChoice(Question $question, Collection $responses): array
    {
        $properties = $question->properties ?? [];
        $options = collect($properties['options'] ?? []);

        $voteCounts = [];
        foreach ($options as $index => $option) {
            $voteCounts[$index] = [
                'label' => $option['option'] ?? "Option {$index}",
                'count' => 0,
            ];
        }

        foreach ($responses as $response) {
            $selectedIndex = $response->response_data['response'] ?? null;
            if ($selectedIndex !== null && isset($voteCounts[$selectedIndex])) {
                $voteCounts[$selectedIndex]['count']++;
            }
        }

        $totalVotes = $responses->count();

        return [
            'type' => 'single_choice',
            'question' => $question->text,
            'totalVotes' => $totalVotes,
            'results' => array_values($voteCounts),
            'chartType' => 'bar',
        ];
    }

    private function aggregateMultipleChoice(Question $question, Collection $responses): array
    {
        $properties = $question->properties ?? [];
        $options = collect($properties['options'] ?? []);

        $selectionCounts = [];
        foreach ($options as $index => $option) {
            $selectionCounts[$index] = [
                'label' => $option['option'] ?? "Option {$index}",
                'count' => 0,
            ];
        }

        foreach ($responses as $response) {
            $selectedIndices = $response->response_data['response'] ?? [];
            if (is_array($selectedIndices)) {
                foreach ($selectedIndices as $index) {
                    if (isset($selectionCounts[$index])) {
                        $selectionCounts[$index]['count']++;
                    }
                }
            }
        }

        $totalResponses = $responses->count();

        return [
            'type' => 'multiple_choice',
            'question' => $question->text,
            'totalResponses' => $totalResponses,
            'results' => array_values($selectionCounts),
            'chartType' => 'bar',
        ];
    }

    private function aggregateSemanticDifferential(Question $question, Collection $responses): array
    {
        $properties = $question->properties ?? [];
        $items = collect($properties['items'] ?? []);

        $itemResults = [];
        foreach ($items as $index => $item) {
            $leftLabel = $item['label_a'] ?? 'Left';
            $rightLabel = $item['label_b'] ?? 'Right';

            $values = collect();
            $responses->map(function ($response) use ($values, $index) {
                $values->push($response->response_data['item_'.$index]);
            });
            $average = $values->isNotEmpty() ? $values->average() : null;

            $itemResults[] = [
                'label' => "{$leftLabel} — {$rightLabel}",
                'leftLabel' => $leftLabel,
                'rightLabel' => $rightLabel,
                'average' => $average,
                'count' => $values->count(),
            ];
        }

        return [
            'type' => 'semantic_differential',
            'question' => $question->text,
            'totalResponses' => $responses->count(),
            'results' => $itemResults,
            'chartType' => 'horizontalBar',
            'scale' => [
                'min' => $properties['minValue'] ?? 1,
                'max' => $properties['size'] ?? 7,
            ],
        ];
    }

    private function aggregateImage(Question $question, Collection $responses): array
    {
        return [
            'type' => 'image',
            'question' => $question->text,
            'viewCount' => $responses->count(),
            'message' => $responses->count() === 1
                ? '1 participant viewed this image'
                : "{$responses->count()} participants viewed this image",
        ];
    }
}
