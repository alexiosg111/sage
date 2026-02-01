import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase';
import { ShoppingBag, ArrowLeft, Eye } from 'lucide-react';

export default async function AdminOrdersPage() {
  const supabase = createServiceClient();
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          Back
          </Link>
          <h1 className="text-3xl font-bold">Orders</h1>
        </div>
      </div>

      {orders && orders.length > 0 ? (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-800/50">
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Order ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Total</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Date</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-zinc-800">
                    <td className="px-6 py-4 font-mono text-sm">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4">{order.customer_email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-500/10 text-green-500'
                            : order.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{order.total.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-zinc-400">
                      {new Date(order.created_at).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg">No orders yet</p>
        </div>
      )}
    </div>
  );
}
