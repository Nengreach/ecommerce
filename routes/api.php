<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

// Public Authentication
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Authenticated Auth
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{idOrSlug}', [ProductController::class, 'show']);

// Cart (Supports Guest Session via X-Session-Id or Bearer auth)
Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/items', [CartController::class, 'store']);
    Route::put('/items/{id}', [CartController::class, 'update']);
    Route::delete('/items/{id}', [CartController::class, 'destroy']);
    Route::delete('/clear', [CartController::class, 'clear']);
});

// Orders
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);

    // Admin Dashboard & Management Routes
    Route::prefix('admin')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/orders', [DashboardController::class, 'orders']);
        Route::put('/orders/{id}/status', [DashboardController::class, 'updateOrderStatus']);
        Route::get('/products', [DashboardController::class, 'products']);
        Route::post('/products', [DashboardController::class, 'storeProduct']);
        Route::put('/products/{id}', [DashboardController::class, 'updateProduct']);
        Route::delete('/products/{id}', [DashboardController::class, 'deleteProduct']);
        Route::post('/categories', [DashboardController::class, 'storeCategory']);
    });
});
