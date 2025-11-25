<?php

namespace App\Filament\Widgets;

use App\Models\QuestionResponse;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Forms\Components\Select;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class Results extends TableWidget
{
    protected int|string|array $columnSpan = 2;

    protected static ?int $sort = 1;

    public function table(Table $table): Table
    {
        return $table
            ->query(fn (): Builder => QuestionResponse::query())
            ->columns([
                TextColumn::make('question.type'),
                TextColumn::make('question.text')
                    ->limit(30),
                TextColumn::make('session_id'),
                TextColumn::make('alias'),
                TextColumn::make('response_data')
                    ->limit(15),
                TextColumn::make('submitted_at')->dateTime(),
            ])
            ->filters([
                SelectFilter::make('session_id')
                    ->multiple()
                    ->options(function () {
                        return QuestionResponse::query()
                            ->select('session_id')
                            ->distinct()
                            ->orderBy('session_id')
                            ->pluck('session_id', 'session_id');
                    }),
            ])
            ->headerActions([
                Action::make('export')
                    ->schema([
                        Select::make('sessionName')
                            ->selectablePlaceholder(false)
                            ->required()
                            ->options(function () {
                                return QuestionResponse::query()
                                    ->select('session_id')
                                    ->distinct()
                                    ->orderBy('session_id')
                                    ->pluck('session_id', 'session_id');
                            }),
                    ])
                    ->action(function (array $data) {
                        $sessionId = $data['sessionName'];

                        // Fetch all responses for the selected session with question data
                        $responses = QuestionResponse::query()
                            ->with('question')
                            ->where('session_id', $sessionId)
                            ->orderBy('submitted_at')
                            ->get();

                        if ($responses->isEmpty()) {
                            Notification::make()
                                ->title('No data found')
                                ->warning()
                                ->send();

                            return;
                        }

                        // Generate CSV content
                        $csvData = [];

                        // Headers
                        $csvData[] = [
                            'Session ID',
                            'Alias',
                            'Role',
                            'Question Type',
                            'Question Text',
                            'Response Data',
                            'Submitted At',
                        ];

                        // Data rows
                        foreach ($responses as $response) {
                            $csvData[] = [
                                $response->session_id,
                                $response->alias ?? '',
                                $response->role ?? '',
                                $response->question->type ?? '',
                                $response->question->text ?? '',
                                is_array($response->response_data)
                                    ? json_encode($response->response_data)
                                    : ($response->response_data ?? ''),
                                $response->submitted_at?->format('Y-m-d H:i:s') ?? '',
                            ];
                        }

                        $csvContent = [];
                        foreach ($csvData as $line) {
                            $csvContent[] = implode("\t", $line);
                        }
                        $csvContent = implode("\n", $csvContent);

                        // Generate filename
                        $filename = 'question_responses_'.$sessionId.'_'.date('Y-m-d_His').'.csv';

                        // Return download response
                        return response()->streamDownload(
                            function () use ($csvContent) {
                                echo $csvContent;
                            },
                            $filename,
                            ['Content-Type' => 'text/csv']
                        );
                    }),
            ]);
    }
}
