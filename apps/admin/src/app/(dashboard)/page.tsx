import { createClient } from '@/lib/supabase';
import { ShoppingBag, Package, Calendar, TrendingUp } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = createClient();

  // In a real app we'd fetch actual data here
  // For now let's show some mock or initial stats
  const { data: products } = await supabase.from('products').select('id');
  const { data: events } = await supabase.from('events').select('id');
  const { data: orders } = await supabase.from('orders').select('id, total').eq('status', 'completed');

  const totalRevenue = orders?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

  const stats = [
    { label: 'Gesamtumsatz', value: `${totalRevenue.toFixed(2)} €`, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Bestellungen', value: orders?.length.toString() || '0', icon: ShoppingBag, color: 'text-blue-600' },
    { label: 'Produkte', value: products?.length.toString() || '0', icon: Package, color: 'text-amber-600' },
    { label: 'Events', value: events?.length.toString() || '0', icon: Calendar, color: 'text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black uppercase mb-8">Übersicht</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-zinc-50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-4">Willkommen im SAGE CLUB Admin</h2>
        <p className="text-zinc-600">
          Hier kannst du den Shop verwalten, neue Tickets anlegen und Bestellungen einsehen.
          Wähle einen Bereich in der Seitenleiste aus, um zu beginnen.
        </p>
      </div>
    </div>
  );
}
