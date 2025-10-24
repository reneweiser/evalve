<?php

use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return to_route('filament.admin.tenant');
});

Route::get('bpl-test', \App\Filament\Pages\BplForm::class);
Route::get('moderator', \App\Filament\Pages\ModeratorView::class)->name('public.moderator');
Route::get('participant', \App\Filament\Pages\ParticipantView::class)->name('public.participant');

Route::get('billboard', fn() => 'billboard placeholder')->name('public.billboard');

Route::get('polling/{question}', function (Question $question) {
    return 'polling placeholder for: '.$question->text;
})->name('public.polling');
