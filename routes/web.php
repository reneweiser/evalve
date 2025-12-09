<?php

use App\Http\Controllers\BillboardController;
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

//Route::get('vr4more-pois', fn (\App\Evalve\Consensive\Vr4MorePoiService $service) => $service->getPois())->name('public.vr4more.pois');
//Route::get('pois', function (\App\Evalve\Consensive\PoiConverter $converter) {
//    return \App\Models\SceneObject::all()->map(fn ($so) => $converter->toVr4MorePoi($so))->toArray();
//})->name('public.pois');
