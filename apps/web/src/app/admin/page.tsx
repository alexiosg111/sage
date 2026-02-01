import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase';
import { DollarSign, ShoppingBag, Package, Calendar, ArrowRight } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = createServiceClient();

  // Fetch stats
  const [{ data: orders }, { data: products }, { data: events }] = await Promise.all([
    supabase.from('orders').select('total, status').eq('status', 'completed'),
    supabase.from('products').select('*').eq('status', 'active'),
    supabase.from('events').select('*').eq('status', 'published').gte('date', new Date().toISOString().split('T')[0]),
  ]);

  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const activeProducts = products?.length || 0;
  const upcomingEvents = events?.length || 0;

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    {
      label: 'Total Revenue',
      value: `${totalRevenue.toFixed(2)} €`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Active Products',
      value: activeProducts.toString(),
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Upcoming Events',
      value: upcomingEvents.toString(),
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-zinc-400 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-800/50">
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Order ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Total</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
            <p>No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
