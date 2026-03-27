<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/about', function () {
    return view('about');
});

Route::get('/certificates', function () {
    return view('certificates');
});

Route::get('/contact', function () {
    return view('contact');
});

Route::get('/projects', function () {
    return view('projects');
});

Route::get('/services', function () {
    return view('services');
});

Route::get('/debug-nav', function () {
    return view('nav');
});
