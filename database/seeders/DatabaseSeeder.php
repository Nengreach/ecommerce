<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Store Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '+1 555 019 2831',
                'address' => '100 Silicon Way',
                'city' => 'San Francisco',
            ]
        );

        $customer = User::firstOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'phone' => '+1 555 014 9820',
                'address' => '742 Evergreen Terrace',
                'city' => 'Springfield',
            ]
        );

        // 2. Categories
        $categoriesData = [
            [
                'name' => 'Audio & Headphones',
                'slug' => 'audio-headphones',
                'description' => 'Premium wireless headphones, noise-canceling earbuds, and audiophile sound systems.',
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'Smartphones & Tablets',
                'slug' => 'smartphones-tablets',
                'description' => 'Latest flagship phones, versatile tablets, and essential everyday mobile devices.',
                'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'Smartwatches & Wearables',
                'slug' => 'smartwatches-wearables',
                'description' => 'Fitness tracking, heart-rate monitors, and next-gen sleek connected smartwatches.',
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'Computers & Laptops',
                'slug' => 'computers-laptops',
                'description' => 'High-performance ultrabooks, creator laptops, and powerful desktop workstations.',
                'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'Cameras & Photography',
                'slug' => 'cameras-photography',
                'description' => 'Mirrorless digital cameras, prime lenses, and professional creative gear.',
                'image' => 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'Accessories & Gadgets',
                'slug' => 'accessories-gadgets',
                'description' => 'Fast chargers, ergonomic stands, minimalist tech sleeves, and desk essentials.',
                'image' => 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $cat) {
            $categories[$cat['slug']] = Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 3. Products
        $productsData = [
            [
                'category_slug' => 'audio-headphones',
                'name' => 'AcousticPro Wireless Noise-Cancelling Headphones',
                'slug' => 'acousticpro-wireless-noise-cancelling-headphones',
                'short_description' => 'Active noise cancellation, 40-hour battery life, and hi-res spatial audio.',
                'description' => 'Experience studio-quality sound anywhere you go. With custom 40mm titanium drivers, adaptive active noise cancellation, and plush memory-foam ear cushions, the AcousticPro delivers rich bass and pristine highs without fatigue.',
                'price' => 299.99,
                'compare_at_price' => 349.99,
                'stock' => 35,
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                'rating' => 4.90,
                'review_count' => 128,
                'is_featured' => true,
                'is_active' => true,
                'gallery' => [
                    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
                ],
            ],
            [
                'category_slug' => 'smartwatches-wearables',
                'name' => 'PulseTrack Ultra Smartwatch Titanium',
                'slug' => 'pulsetrack-ultra-smartwatch-titanium',
                'short_description' => 'Aerospace-grade titanium chassis, always-on AMOLED display, and dual-band GPS.',
                'description' => 'Engineered for athletes and adventurers. Water-resistant up to 100 meters, ECG monitoring, blood-oxygen sensors, and up to 14 days of battery life on a single fast wireless charge.',
                'price' => 449.00,
                'compare_at_price' => 499.00,
                'stock' => 20,
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
                'rating' => 4.85,
                'review_count' => 94,
                'is_featured' => true,
                'is_active' => true,
                'gallery' => [
                    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
                ],
            ],
            [
                'category_slug' => 'audio-headphones',
                'name' => 'NovaPod True Wireless Earbuds',
                'slug' => 'novapod-true-wireless-earbuds',
                'short_description' => 'Ultra-compact earbuds with transparency mode and wireless charging case.',
                'description' => 'Crisp, crystal-clear sound in an astonishingly light profile. Features IPX7 water resistance, seamless touch controls, and up to 32 total hours of playback with the pocket charging capsule.',
                'price' => 149.99,
                'compare_at_price' => 179.99,
                'stock' => 50,
                'image' => 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
                'rating' => 4.70,
                'review_count' => 82,
                'is_featured' => true,
                'is_active' => true,
                'gallery' => [],
            ],
            [
                'category_slug' => 'computers-laptops',
                'name' => 'Veloce 16X M-Series Laptop',
                'slug' => 'veloce-16x-m-series-laptop',
                'short_description' => '16-inch Liquid Retina XDR display, 32GB Unified RAM, 1TB NVMe SSD.',
                'description' => 'Unleash extreme computing power for programming, 3D rendering, and 4K video editing. Built with an all-aluminum unibody design and exceptional 22-hour battery efficiency.',
                'price' => 1899.00,
                'compare_at_price' => 2099.00,
                'stock' => 12,
                'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
                'rating' => 4.95,
                'review_count' => 43,
                'is_featured' => true,
                'is_active' => true,
                'gallery' => [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
                ],
            ],
            [
                'category_slug' => 'cameras-photography',
                'name' => 'Lumix Retro Mirrorless 4K Camera',
                'slug' => 'lumix-retro-mirrorless-4k-camera',
                'short_description' => 'Classic aesthetic with modern 33MP full-frame sensor and 4K/60p video.',
                'description' => 'Combining vintage dials with high-speed phase-detection autofocus and in-body 5-axis image stabilization. Perfect for street photographers, travel vloggers, and enthusiasts alike.',
                'price' => 1199.50,
                'compare_at_price' => 1350.00,
                'stock' => 15,
                'image' => 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
                'rating' => 4.80,
                'review_count' => 67,
                'is_featured' => false,
                'is_active' => true,
                'gallery' => [],
            ],
            [
                'category_slug' => 'accessories-gadgets',
                'name' => 'MagCharge 3-in-1 Fast Wireless Stand',
                'slug' => 'magcharge-3-in-1-fast-wireless-stand',
                'short_description' => 'Simultaneously charge phone, smartwatch, and wireless earbuds with 15W MagSafe.',
                'description' => 'Declutter your nightstand or workspace with this weighted brushed alloy charging dock. Strong magnetic alignment ensures optimal charging efficiency every time.',
                'price' => 89.99,
                'compare_at_price' => 109.99,
                'stock' => 60,
                'image' => 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
                'rating' => 4.65,
                'review_count' => 112,
                'is_featured' => true,
                'is_active' => true,
                'gallery' => [],
            ],
            [
                'category_slug' => 'accessories-gadgets',
                'name' => 'KeyForge Mechanical Wireless Keyboard',
                'slug' => 'keyforge-mechanical-wireless-keyboard',
                'short_description' => '75% compact layout, hot-swappable switches, PBT double-shot keycaps.',
                'description' => 'Gasket-mounted sound dampening creates a delightfully tactile, deep acoustic typing experience. Connect via Bluetooth 5.2, 2.4GHz wireless dongle, or USB-C.',
                'price' => 129.00,
                'compare_at_price' => 149.00,
                'stock' => 28,
                'image' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
                'rating' => 4.90,
                'review_count' => 76,
                'is_featured' => true,
                'is_active' => true,
                'gallery' => [],
            ],
            [
                'category_slug' => 'smartphones-tablets',
                'name' => 'AeroTab Pro 12.9 Liquid OLED',
                'slug' => 'aerotab-pro-12-9-liquid-oled',
                'short_description' => '120Hz ProMotion display, pencil gesture support, all-day 10,000mAh battery.',
                'description' => 'The ultimate digital canvas and mobile workstation. Ultra-thin 5.8mm chassis with quad stereo speakers tuned by spatial acoustic engineers.',
                'price' => 899.00,
                'compare_at_price' => 999.00,
                'stock' => 22,
                'image' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
                'rating' => 4.75,
                'review_count' => 54,
                'is_featured' => false,
                'is_active' => true,
                'gallery' => [],
            ],
            [
                'category_slug' => 'accessories-gadgets',
                'name' => 'ErgoLift Aluminum Laptop Stand',
                'slug' => 'ergolift-aluminum-laptop-stand',
                'short_description' => 'Adjustable height and angle with non-slip silicone pads and heat ventilation.',
                'description' => 'Elevate your screen to eye level to improve posture and relieve neck strain. Precision CNC machined from aircraft-grade aluminum alloy.',
                'price' => 49.99,
                'compare_at_price' => 65.00,
                'stock' => 85,
                'image' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
                'rating' => 4.88,
                'review_count' => 140,
                'is_featured' => false,
                'is_active' => true,
                'gallery' => [],
            ],
            [
                'category_slug' => 'audio-headphones',
                'name' => 'SoundSphere 360 Portable Waterproof Speaker',
                'slug' => 'soundsphere-360-portable-waterproof-speaker',
                'short_description' => 'Omnidirectional punchy bass, IP67 dust/waterproof, 20h playtime.',
                'description' => 'Take the party anywhere from beach days to camping trips. Pair two speakers in PartyMode for double the volume and wide stereo immersion.',
                'price' => 119.00,
                'compare_at_price' => 139.00,
                'stock' => 40,
                'image' => 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
                'rating' => 4.78,
                'review_count' => 89,
                'is_featured' => false,
                'is_active' => true,
                'gallery' => [],
            ],
        ];

        foreach ($productsData as $pData) {
            $cat = $categories[$pData['category_slug']] ?? null;
            if (! $cat) {
                continue;
            }

            $gallery = $pData['gallery'] ?? [];
            unset($pData['category_slug'], $pData['gallery']);
            $pData['category_id'] = $cat->id;

            $product = Product::firstOrCreate(['slug' => $pData['slug']], $pData);

            // Add gallery images
            foreach ($gallery as $idx => $imgUrl) {
                ProductImage::firstOrCreate(
                    ['product_id' => $product->id, 'image_url' => $imgUrl],
                    ['is_primary' => false]
                );
            }

            // Add 1-2 realistic reviews
            Review::firstOrCreate(
                ['product_id' => $product->id, 'user_id' => $customer->id],
                [
                    'user_name' => $customer->name,
                    'rating' => 5,
                    'title' => 'Exceptional build quality and performance!',
                    'comment' => 'Arrived quickly in pristine packaging. Exceeded my expectations in everyday use.',
                ]
            );
        }
    }
}
