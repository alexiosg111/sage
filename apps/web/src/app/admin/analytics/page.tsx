import { createServiceClient } from '@/lib/supabase';
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingBag,
  Package,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export default async function AdminAnalyticsPage() {
  const supabase = createServiceClient();

  // Fetch all data needed for analytics
  const [
    { data: orders },
    { data: products },
    { data: events },
  ] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('products').select('*'),
    supabase.from('events').select('*'),
  ]);

  // Calculate metrics
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const completedOrders = orders?.filter((o) => o.status === 'completed').length || 0;
  const uniqueCustomers = new Set(orders?.map((o) => o.customer_email)).size;

  // Calculate revenue by month (last 6 months)
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: month.toLocaleDateString('de-DE', { month: 'short', year: '2-digit' }),
      startDate: month.toISOString().split('T')[0],
      endDate: new Date(month.getFullYear(), month.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0],
    });
  }

  const revenueByMonth = months.map((month) => ({
    ...month,
    revenue:
      orders
        ?.filter(
          (order) =>
            order.created_at >= month.startDate && order.created_at <= month.endDate
        )
        .reduce((sum, order) => sum + (order.total || 0), 0) || 0,
    orders:
      orders?.filter(
        (order) =>
          order.created_at >= month.startDate && order.created_at <= month.endDate
      ).length || 0,
  }));

  // Top selling products
  const productSales = new Map<string, number>();
  const productSalesMap = new Map<string, { name: string; image_url: string | null; price: number }>();
  
  products?.forEach((product) => {
    productSalesMap.set(product.id, {
      name: product.name,
      image_url: product.image_url,
      price: product.price,
    });
  });

  orders?.forEach((order) => {
    if (order.status === 'completed') {
      productSales.set(order.id, (productSales.get(order.id) || 0) + 1);
    }
  });

  const topProducts = Array.from(productSales.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([productId, count]) => ({
      ...productSalesMap.get(productId),
      count,
    }));

  // Order status distribution
  const orderStatuses = [
    { status: 'completed', count: orders?.filter((o) => o.status === 'completed').length || 0, color: 'bg-green-500' },
    { status: 'pending', count: orders?.filter((o) => o.status === 'pending').length || 0, color: 'bg-amber-500' },
    { status: 'cancelled', count: orders?.filter((o) => o.status === 'cancelled').length || 0, color: 'bg-red-500' },
  ];

  // Recent activity
  const recentActivity = orders?.slice(0, 10).map((order) => ({
    id: order.id,
    type: 'order',
    status: order.status,
    total: order.total,
    customer: order.customer_email,
    date: order.created_at,
  })) || [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <span className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUp className="w-4 h-4" />
              12.5%
            </span>
          </div>
          <p className="text-zinc-400 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">{totalRevenue.toFixed(2)} €</p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-500" />
            </div>
            <span className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUp className="w-4 h-4" />
              8.2%
            </span>
          </div>
          <p className="text-zinc-400 text-sm mb-1">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <span className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUp className="w-4 h-4" />
              15.3%
            </span>
          </div>
          <p className="text-zinc-400 text-sm mb-1">Unique Customers</p>
          <p className="text-2xl font-bold">{uniqueCustomers}</p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-500" />
            </div>
            <span className="flex items-center gap-1 text-amber-500 text-sm">
              <ArrowDown className="w-4 h-4" />
              3.1%
            </span>
          </div>
          <p className="text-zinc-400 text-sm mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold">
            {totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-6">Revenue Trend</h2>
          <div className="flex items-end justify-between gap-4 h-64">
            {revenueByMonth.map((data) => {
              const maxRevenue = Math.max(...revenueByMonth.map((d) => d.revenue)) || 1;
              const height = (data.revenue / maxRevenue) * 100;
              return (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-zinc-800 rounded-t-lg relative group h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-lg transition-all hover:from-amber-500 hover:to-amber-400"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.revenue.toFixed(2)} €
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400">{data.month}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-6">Order Status</h2>
          <div className="space-y-4">
            {orderStatuses.map((item) => (
              <div key={item.status} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400 capitalize">{item.status}</span>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${totalOrders > 0 ? (item.count / totalOrders) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Top Products
          </h2>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {product?.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{product?.name}</p>
                    <p className="text-sm text-zinc-400">{product?.price.toFixed(2)} €</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{product?.count}</p>
                    <p className="text-xs text-zinc-400">sold</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-400">
              <Package className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
              <p>No sales data yet</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Activity
          </h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.status === 'completed'
                        ? 'bg-green-500/10 text-green-500'
                        : activity.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.customer}</p>
                    <p className="text-sm text-zinc-400">
                      {new Date(activity.date).toLocaleDateString('de-DE')} •{' '}
                      {activity.total.toFixed(2)} €
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      activity.status === 'completed'
                        ? 'bg-green-500/10 text-green-500'
                        : activity.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
