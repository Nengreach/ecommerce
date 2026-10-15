<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CartController extends Controller
{
    /**
     * Get or create active cart for auth user or guest session.
     */
    protected function getCart(Request $request): Cart
    {
        $user = $request->user('sanctum');
        $sessionId = $request->header('X-Session-Id') ?: $request->input('session_id');

        if ($user) {
            $userCart = Cart::firstOrCreate(['user_id' => $user->id]);

            // Merge guest cart if session_id is provided
            if ($sessionId) {
                $guestCart = Cart::where('session_id', $sessionId)->first();
                if ($guestCart && $guestCart->id !== $userCart->id) {
                    foreach ($guestCart->items as $gItem) {
                        $existing = CartItem::where('cart_id', $userCart->id)
                            ->where('product_id', $gItem->product_id)
                            ->first();

                        if ($existing) {
                            $existing->update(['quantity' => $existing->quantity + $gItem->quantity]);
                        } else {
                            $gItem->update(['cart_id' => $userCart->id]);
                        }
                    }
                    $guestCart->delete();
                }
            }

            return $userCart;
        }

        if (! $sessionId) {
            $sessionId = (string) Str::uuid();
        }

        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }

    /**
     * Display the cart with items and calculations.
     */
    public function index(Request $request): JsonResponse
    {
        $cart = $this->getCart($request);
        $cart->load(['items.product.category']);

        $subtotal = 0;
        $totalItems = 0;

        foreach ($cart->items as $item) {
            $subtotal += (float) $item->price * $item->quantity;
            $totalItems += $item->quantity;
        }

        $tax = round($subtotal * 0.08, 2);
        $shipping = $subtotal > 100 || $subtotal == 0 ? 0 : 15.00;
        $total = $subtotal + $tax + $shipping;

        return response()->json([
            'cart_id' => $cart->id,
            'session_id' => $cart->session_id,
            'items' => $cart->items,
            'total_items' => $totalItems,
            'subtotal' => round($subtotal, 2),
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => round($total, 2),
        ]);
    }

    /**
     * Add an item to the cart.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);

        $quantity = $validated['quantity'] ?? 1;
        $product = Product::findOrFail($validated['product_id']);
        $cart = $this->getCart($request);

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $quantity);
        } else {
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $product->price,
            ]);
        }

        return $this->index($request);
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = $this->getCart($request);
        $cartItem = CartItem::where('cart_id', $cart->id)->where('id', $id)->firstOrFail();

        $cartItem->update(['quantity' => $validated['quantity']]);

        return $this->index($request);
    }

    /**
     * Remove item from cart.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $cart = $this->getCart($request);
        CartItem::where('cart_id', $cart->id)->where('id', $id)->delete();

        return $this->index($request);
    }

    /**
     * Clear all items in cart.
     */
    public function clear(Request $request): JsonResponse
    {
        $cart = $this->getCart($request);
        $cart->items()->delete();

        return $this->index($request);
    }
}
