import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params;
  const supabase = createClient();

  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('id', id)
    .single();

  if (!data) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = data as any;

  // Need to handle that events are not linked to products in this query
  // For simplicity, if product_id is null, it's a ticket.
  // We should ideally also fetch events if product_id is null.

  return (
    <div>
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-black mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Übersicht
      </Link>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase">Bestellung #{order.id.slice(0, 8)}</h1>
          <p className="text-zinc-500 mt-2">Aufgegeben am {new Date(order.created_at).toLocaleString('de-DE')}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${
          order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-200 bg-zinc-50">
              <h2 className="font-bold uppercase flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Artikel
              </h2>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="px-6 py-4 text-sm font-bold uppercase text-zinc-500">Artikel</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase text-zinc-500 text-center">Menge</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase text-zinc-500 text-right">Preis</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase text-zinc-500 text-right">Gesamt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {order.order_items?.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <p className="font-bold">{item.products?.name || 'Ticket'}</p>
                      <p className="text-xs text-zinc-500 font-mono">ID: {item.product_id || 'TICKET'}</p>
                    </td>
                    <td className="px-6 py-4 text-center">{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-mono">{item.price.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right font-mono font-bold">{(item.price * item.quantity).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-zinc-50 font-bold">
                  <td colSpan={3} className="px-6 py-4 text-right uppercase">Summe</td>
                  <td className="px-6 py-4 text-right font-mono text-xl text-primary-foreground bg-primary">{order.total.toFixed(2)} €</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-bold uppercase mb-4 border-b border-zinc-100 pb-2">Kundeninformationen</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-zinc-500 uppercase text-[10px] font-bold">Email</p>
                <p className="font-medium">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-zinc-500 uppercase text-[10px] font-bold">Stripe Session</p>
                <p className="font-mono text-xs break-all">{order.stripe_session_id || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
