<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Services\QuestionResultsService;
use Illuminate\Http\Request;

class BillboardController extends Controller
{
    public function __construct(
        private readonly QuestionResultsService $resultsService
    ) {}

    public function showResults(Request $request, string $questionId)
    {
        $question = Question::findOrFail($questionId);
        $results = $this->resultsService->aggregateResults($question);

        return view('billboard-results', [
            'question' => $question,
            'results' => $results,
        ]);
    }
}
