import Link from 'next/link';
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Checkout Cancelled</h1>
        <p className="text-zinc-400 mb-8">
          Your payment was cancelled. Don&apos;t worry, your cart items are still saved.
        </p>

        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-8">
          <h2 className="font-semibold mb-4">Need Help?</h2>
          <p className="text-sm text-zinc-400">
            If you experienced any issues during checkout, please try again or contact our support team.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/shop/cart"
            className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 text-zinc-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Return to Cart
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
