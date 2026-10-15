<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of orders for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id)
            ->with(['items.product', 'payment'])
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    /**
     * Store a newly created order.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:50'],
            'shipping_address' => ['required', 'string'],
            'payment_method' => ['required', 'string', 'in:card,cod,paypal'],
            'notes' => ['nullable', 'string'],
            'cart_id' => ['nullable', 'exists:carts,id'],
            'items' => ['nullable', 'array'],
            'items.*.product_id' => ['required_with:items', 'exists:products,id'],
            'items.*.quantity' => ['required_with:items', 'integer', 'min:1'],
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $user = $request->user('sanctum');

            // Gather items from payload or from database cart
            $orderItemsData = [];
            $subtotal = 0;

            if (! empty($validated['items'])) {
                foreach ($validated['items'] as $itemInput) {
                    $prod = Product::findOrFail($itemInput['product_id']);
                    $qty = (int) $itemInput['quantity'];
                    $itemSubtotal = (float) $prod->price * $qty;
                    $subtotal += $itemSubtotal;

                    $orderItemsData[] = [
                        'product_id' => $prod->id,
                        'product_name' => $prod->name,
                        'product_image' => $prod->image,
                        'unit_price' => $prod->price,
                        'quantity' => $qty,
                        'subtotal' => $itemSubtotal,
                    ];
                }
            } elseif (! empty($validated['cart_id'])) {
                $cart = Cart::with('items.product')->findOrFail($validated['cart_id']);
                foreach ($cart->items as $cartItem) {
                    $itemSubtotal = (float) $cartItem->price * $cartItem->quantity;
                    $subtotal += $itemSubtotal;

                    $orderItemsData[] = [
                        'product_id' => $cartItem->product_id,
                        'product_name' => $cartItem->product->name,
                        'product_image' => $cartItem->product->image,
                        'unit_price' => $cartItem->price,
                        'quantity' => $cartItem->quantity,
                        'subtotal' => $itemSubtotal,
                    ];
                }
            } else {
                return response()->json(['message' => 'No items provided for order.'], 422);
            }

            if (empty($orderItemsData)) {
                return response()->json(['message' => 'Cart or item list is empty.'], 422);
            }

            $tax = round($subtotal * 0.08, 2);
            $shipping = $subtotal > 100 ? 0 : 15.00;
            $total = $subtotal + $tax + $shipping;

            $orderNumber = 'ORD-'.strtoupper(Str::random(8));

            $order = Order::create([
                'user_id' => $user?->id,
                'order_number' => $orderNumber,
                'status' => 'processing',
                'subtotal' => $subtotal,
                'tax_amount' => $tax,
                'shipping_fee' => $shipping,
                'total_amount' => $total,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_method'] === 'cod' ? 'pending' : 'paid',
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'] ?? null,
                'shipping_address' => $validated['shipping_address'],
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($orderItemsData as $itemRow) {
                $order->items()->create($itemRow);
            }

            // Create payment record
            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $validated['payment_method'],
                'transaction_id' => 'TXN-'.strtoupper(Str::random(10)),
                'amount' => $total,
                'status' => $validated['payment_method'] === 'cod' ? 'pending' : 'completed',
                'payload' => [
                    'timestamp' => now()->toISOString(),
                    'method' => $validated['payment_method'],
                ],
            ]);

            // Clear cart if provided
            if (! empty($validated['cart_id'])) {
                Cart::where('id', $validated['cart_id'])->first()?->items()->delete();
            }

            $order->load(['items.product', 'payment']);

            return response()->json([
                'message' => 'Order created successfully',
                'data' => $order,
            ], 201);
        });
    }

    /**
     * Display the specified order by order_number.
     */
    public function show(string $orderNumber): JsonResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['items.product', 'payment'])
            ->firstOrFail();

        return response()->json([
            'data' => $order,
        ]);
    }
}
