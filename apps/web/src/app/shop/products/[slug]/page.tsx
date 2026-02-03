'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { createClient } from '@/lib/supabase';
import { Package, ArrowLeft, Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';

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
      <main className="min-h-screen">
        <Navigation />
        <div className="py-40 px-6 text-center">
          <p className="mono animate-pulse">Lade Produkt...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="py-40 px-6 text-center">
          <div className="mono mb-4 text-red-500">404</div>
          <h1 className="text-4xl font-black uppercase mb-8">Produkt nicht gefunden</h1>
          <Link href="/shop" className="inline-block border-b border-[var(--accent)] text-white hover:text-[var(--accent)] transition-colors">
            Zurück zum Shop
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
    <main className="min-h-screen pt-20">
      <Navigation />
      
      <div className="py-12 px-6 max-w-[1200px] mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 mono text-xs text-[#888] hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          ZURÜCK ZUM SHOP
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div className="aspect-square bg-black border border-[#333333] relative overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-[#333]" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-12">
              <div className="mono text-[var(--accent)] mb-4">Official Merchandise</div>
              <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tighter leading-tight">{product.name}</h1>
              <p className="text-3xl font-black font-mono text-[var(--accent)] mb-8">
                {product.price.toFixed(2)} €
              </p>
              
              {product.description && (
                <div className="border-t border-[#333333] pt-8">
                  <p className="text-[#888] leading-relaxed text-lg whitespace-pre-wrap">{product.description}</p>
                </div>
              )}
            </div>

            {/* Stock & Quantity */}
            <div className="bg-[#141414] border border-[#333333] p-8">
              {/* Stock Status */}
              <div className="mb-8 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-[var(--accent)]'}`} />
                {isOutOfStock ? (
                  <span className="mono text-xs text-red-500">AUSVERKAUFT</span>
                ) : isLowStock ? (
                  <span className="mono text-xs text-[var(--accent)]">NUR NOCH {product.stock} VERFÜGBAR</span>
                ) : (
                  <span className="mono text-xs text-[var(--accent)]">AUF LAGER</span>
                )}
              </div>

              {!isOutOfStock && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <span className="mono text-xs text-[#888]">ANZAHL</span>
                    <div className="flex items-center border border-[#333333]">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="p-4 hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-mono font-bold text-xl">{quantity}</span>
                      <button
                        onClick={incrementQuantity}
                        disabled={quantity >= product.stock}
                        className="p-4 hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || isAdded}
                      className={`flex-1 py-5 font-bold uppercase transition-all flex items-center justify-center gap-3 ${
                        isAdded
                          ? 'bg-green-600 text-white'
                          : 'bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-5 h-5" />
                          Hinzugefügt
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          In den Warenkorb
                        </>
                      )}
                    </button>
                    
                    <Link
                      href="/shop/cart"
                      className="px-8 py-5 border border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-all"
                    >
                      Warenkorb
                    </Link>
                  </div>
                </div>
              )}

              {isOutOfStock && (
                <button
                  disabled
                  className="w-full py-5 border border-[#333333] text-[#444] font-bold uppercase cursor-not-allowed"
                >
                  Sold Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
