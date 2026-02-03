'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          customerEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const { url } = await response.json();
      
      // Clear cart and redirect to Stripe
      clearCart();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="py-40 px-6 max-w-[1200px] mx-auto text-center">
          <div className="mono mb-4">Your Bag</div>
          <h1 className="text-4xl md:text-6xl font-black uppercase mb-8">Warenkorb ist leer</h1>
          <p className="text-[#888] mb-12 max-w-md mx-auto">Du hast noch keine Artikel in deinen Warenkorb gelegt. Schau dir unsere Tickets und Merch an.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-black font-bold uppercase hover:bg-[var(--accent-hover)] transition-all"
          >
            Zum Shop
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24">
      <Navigation />
      
      <div className="py-12 px-6 max-w-[1200px] mx-auto">
        <div className="mono mb-4">Checkout</div>
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-12">Warenkorb</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-[#141414] border border-[#333333] p-6 flex items-center gap-6"
              >
                <div className="w-24 h-24 bg-black border border-[#333333] flex-shrink-0 overflow-hidden relative">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-[#333]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold uppercase truncate mb-1">{item.name}</h3>
                  <p className="text-[var(--accent)] font-mono font-bold">{item.price.toFixed(2)} €</p>
                </div>

                <div className="flex items-center gap-4 border border-[#333333] px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-2 hover:text-[var(--accent)] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-mono font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-2 hover:text-[var(--accent)] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="font-mono font-bold text-xl">{(item.price * item.quantity).toFixed(2)} €</p>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-2 text-[#444] hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button
              onClick={() => clearCart()}
              className="mono text-xs text-[#444] hover:text-red-600 transition-colors"
            >
              Warenkorb leeren
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#141414] border border-[#333333] p-8 sticky top-32">
              <h2 className="text-2xl font-black uppercase mb-8">Zusammenfassung</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-[#888] font-mono">
                  <span>Zwischensumme</span>
                  <span>{getTotalPrice().toFixed(2)} €</span>
                </div>
                <div className="flex items-center justify-between text-[#888] font-mono">
                  <span>Versand</span>
                  <span>KOSTENLOS</span>
                </div>
                <div className="border-t border-[#333333] pt-6 flex items-center justify-between">
                  <span className="font-bold uppercase">Gesamt</span>
                  <span className="text-3xl font-black text-[var(--accent)] font-mono">
                    {getTotalPrice().toFixed(2)} €
                  </span>
                </div>
              </div>

              {!showCheckoutForm ? (
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full py-4 bg-[var(--accent)] text-black font-bold uppercase hover:bg-[var(--accent-hover)] transition-all"
                >
                  Zur Kasse
                </button>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="mono block text-xs mb-2">
                      Email Addresse
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-[#333333] text-white focus:border-[var(--accent)] outline-none transition-all font-mono"
                      placeholder="deine@email.de"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowCheckoutForm(false)}
                      className="flex-1 py-4 border border-[#333333] font-bold uppercase hover:bg-[#222] transition-colors"
                    >
                      Zurück
                    </button>
                    <button
                      type="submit"
                      disabled={isCheckingOut}
                      className="flex-1 py-4 bg-[var(--accent)] text-black font-bold uppercase hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          ...
                        </>
                      ) : (
                        'Bezahlen'
                      )}
                    </button>
                  </div>
                </form>
              )}

              <Link
                href="/shop"
                className="block text-center mt-6 mono text-xs text-[#444] hover:text-white transition-colors"
              >
                Weiter Einkaufen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
