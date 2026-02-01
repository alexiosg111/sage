'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const router = useRouter();

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
      <main className="min-h-screen bg-zinc-950">
        <Navigation />
        <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-zinc-400 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-zinc-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 flex items-center gap-4"
              >
                <div className="w-20 h-20 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-zinc-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-amber-500">{item.price.toFixed(2)} €</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <p className="font-bold">{(item.price * item.quantity).toFixed(2)} €</p>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button
              onClick={() => clearCart()}
              className="text-sm text-zinc-500 hover:text-red-500 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>{getTotalPrice().toFixed(2)} €</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold text-amber-500">
                    {getTotalPrice().toFixed(2)} €
                  </span>
                </div>
              </div>

              {!showCheckoutForm ? (
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full py-4 bg-amber-500 text-zinc-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCheckoutForm(false)}
                      className="flex-1 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isCheckingOut}
                      className="flex-1 py-3 bg-amber-500 text-zinc-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Pay'
                      )}
                    </button>
                  </div>
                </form>
              )}

              <Link
                href="/shop"
                className="block text-center mt-4 text-zinc-400 hover:text-white transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
