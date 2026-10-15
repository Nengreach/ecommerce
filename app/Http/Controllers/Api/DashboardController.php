<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DashboardController extends Controller
{
    /**
     * Check if authenticated user is admin.
     */
    protected function authorizeAdmin(Request $request): void
    {
        $user = $request->user();
        if (! $user || $user->role !== 'admin') {
            abort(403, 'Unauthorized. Admin privileges required.');
        }
    }

    /**
     * Get aggregate dashboard statistics for admin.
     */
    public function stats(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $totalRevenue = (float) Order::where('status', '!=', 'cancelled')->sum('total_amount');
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalCustomers = User::where('role', 'customer')->count();

        $recentOrders = Order::with(['items.product', 'user'])
            ->latest()
            ->take(6)
            ->get();

        $lowStockProducts = Product::where('stock', '<=', 15)
            ->orderBy('stock', 'asc')
            ->take(5)
            ->get(['id', 'name', 'stock', 'price', 'image']);

        $ordersByStatus = [
            'pending' => Order::where('status', 'pending')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];

        return response()->json([
            'metrics' => [
                'total_revenue' => round($totalRevenue, 2),
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'total_customers' => $totalCustomers,
            ],
            'recent_orders' => $recentOrders,
            'low_stock_products' => $lowStockProducts,
            'orders_by_status' => $ordersByStatus,
        ]);
    }

    /**
     * List all orders for admin with optional status filtering.
     */
    public function orders(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $query = Order::with(['items.product', 'payment', 'user'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'ILIKE', "%{$search}%")
                    ->orWhere('customer_name', 'ILIKE', "%{$search}%")
                    ->orWhere('customer_email', 'ILIKE', "%{$search}%");
            });
        }

        $perPage = (int) $request->query('per_page', 15);

        return response()->json($query->paginate($perPage));
    }

    /**
     * Update order status.
     */
    public function updateOrderStatus(Request $request, string $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,processing,shipped,delivered,cancelled'],
            'payment_status' => ['nullable', 'string', 'in:pending,paid,failed,refunded'],
        ]);

        $order = Order::findOrFail($id);
        $order->update($validated);

        return response()->json([
            'message' => 'Order status updated successfully',
            'data' => $order->fresh(['items.product', 'payment']),
        ]);
    }

    /**
     * List all products for admin with pagination and search.
     */
    public function products(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $query = Product::with('category')->latest();

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('slug', 'ILIKE', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        $perPage = (int) $request->query('per_page', 20);

        return response()->json($query->paginate($perPage));
    }

    /**
     * Create a new product.
     */
    public function storeProduct(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'image' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $slug = Str::slug($validated['name']);
        // Ensure unique slug
        $originalSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $product = Product::create([
            ...$validated,
            'slug' => $slug,
            'is_featured' => $validated['is_featured'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
            'image' => $validated['image'] ?: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product->load('category'),
        ], 201);
    }

    /**
     * Update an existing product.
     */
    public function updateProduct(Request $request, string $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'image' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product->fresh('category'),
        ]);
    }

    /**
     * Delete a product.
     */
    public function deleteProduct(Request $request, string $id): JsonResponse
    {
        $this->authorizeAdmin($request);

        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }

    /**
     * Store a new category.
     */
    public function storeCategory(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $category = Category::create([
            ...$validated,
            'slug' => $slug,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category,
        ], 201);
    }
}
