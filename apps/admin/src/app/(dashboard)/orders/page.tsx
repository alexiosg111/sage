import { createClient } from '@/lib/supabase';
import { ExternalLink } from 'lucide-react';
import { Order } from '@/types';
import Link from 'next/link';

export default async function OrdersPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  const orders = data as Order[] | null;

  return (
    <div>
      <h1 className="text-3xl font-black uppercase mb-8">Bestellungen</h1>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">ID</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Datum</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Kunde</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Betrag</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Status</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {orders?.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-zinc-500">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4">
                  {new Date(order.created_at).toLocaleDateString('de-DE')}
                </td>
                <td className="px-6 py-4 font-bold">{order.customer_email}</td>
                <td className="px-6 py-4 font-mono font-bold">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded">
                    {order.total.toFixed(2)} €
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/orders/${order.id}`}
                    className="p-2 text-zinc-400 hover:text-black transition-colors inline-block"
                    title="Details ansehen"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  Keine Bestellungen gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
