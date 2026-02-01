'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { createClient } from '@/lib/supabase';
import { Package, ArrowLeft, Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  status: string;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();
      
      setProduct(data);
      setIsLoading(false);
    };

    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-950">
        <Navigation />
        <div className="py-20 px-4 text-center">
          <p className="text-zinc-400">Loading...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-zinc-950">
        <Navigation />
        <div className="py-20 px-4 text-center">
          <p className="text-zinc-400">Product not found</p>
          <Link href="/shop" className="text-amber-500 hover:underline mt-4 inline-block">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (product.stock < quantity) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;

  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                <Package className="w-24 h-24 text-zinc-600" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-amber-500 mb-6">
              {product.price.toFixed(2)} €
            </p>
            
            {product.description && (
              <p className="text-zinc-300 mb-8 leading-relaxed">{product.description}</p>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {isOutOfStock ? (
                <span className="text-red-500 font-medium">Out of Stock</span>
              ) : isLowStock ? (
                <span className="text-amber-500 font-medium">Only {product.stock} left in stock</span>
              ) : (
                <span className="text-green-500 font-medium">In Stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-zinc-400">Quantity</span>
                <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-800">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdded}
                className={`flex-1 py-4 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-green-500 text-white'
                    : isOutOfStock
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
              
              <Link
                href="/shop/cart"
                className="px-6 py-4 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
