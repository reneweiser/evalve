<?php

use App\Http\Controllers\BillboardController;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return to_route('filament.admin.tenant');
});

Route::get('bpl-test', \App\Filament\Pages\BplForm::class);
Route::get('moderator', \App\Filament\Pages\ModeratorView::class)->name('public.moderator');
Route::get('participant', \App\Filament\Pages\ParticipantView::class)->name('public.participant');

Route::get('billboard/{questionId}', [BillboardController::class, 'showResults'])->name('public.billboard');
Route::get('polling', function () {
    $image = \Illuminate\Support\Facades\Storage::disk('public')->url(request()->get('image'));
    return view('polling', ['image' => $image]);
})->name('public.polling');
