import Link from 'next/link';
import { CheckCircle, Package, Calendar } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p className="text-zinc-400 mb-8">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </p>

        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-8">
          <h2 className="font-semibold mb-4">What&apos;s Next?</h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-zinc-400">
                  We&apos;re preparing your items for shipment.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Event Tickets</p>
                <p className="text-sm text-zinc-400">
                  Tickets will be sent to your email within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/shop"
            className="block w-full py-3 bg-amber-500 text-zinc-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/events"
            className="block w-full py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
          >
            View Events
          </Link>
        </div>
      </div>
    </main>
  );
}
