<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return to_route('filament.admin.tenant');
});

Route::get('bpl-test', \App\Filament\Pages\BplForm::class);

