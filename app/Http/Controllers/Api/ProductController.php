<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of products with filtering, search, and sorting.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::where('is_active', true)->with('category');

        // Filter by category slug or ID
        if ($request->filled('category')) {
            $catParam = $request->query('category');
            $query->whereHas('category', function ($q) use ($catParam) {
                if (is_numeric($catParam)) {
                    $q->where('id', $catParam);
                } else {
                    $q->where('slug', $catParam);
                }
            });
        }

        // Search in title and description
        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('description', 'ILIKE', "%{$search}%")
                    ->orWhere('short_description', 'ILIKE', "%{$search}%");
            });
        }

        // Filter featured
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        // Sorting
        $sort = $request->query('sort', 'latest');
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'rating' => $query->orderBy('rating', 'desc'),
            'name_asc' => $query->orderBy('name', 'asc'),
            default => $query->latest(),
        };

        $perPage = min((int) $request->query('per_page', 12), 50);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Get featured products.
     */
    public function featured(): JsonResponse
    {
        $featured = Product::where('is_active', true)
            ->where('is_featured', true)
            ->with('category')
            ->take(8)
            ->get();

        return response()->json([
            'data' => $featured,
        ]);
    }

    /**
     * Display the specified product by slug or id.
     */
    public function show(string $idOrSlug): JsonResponse
    {
        $product = Product::where('is_active', true)
            ->where(function ($q) use ($idOrSlug) {
                if (is_numeric($idOrSlug)) {
                    $q->where('id', $idOrSlug);
                } else {
                    $q->where('slug', $idOrSlug);
                }
            })
            ->with(['category', 'images', 'reviews' => function ($q) {
                $q->latest();
            }])
            ->firstOrFail();

        // Get related products from same category
        $related = Product::where('is_active', true)
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return response()->json([
            'data' => $product,
            'related' => $related,
        ]);
    }
}
