import Link from 'next/link';
import { LayoutDashboard, Package, Calendar, ShoppingBag, LogOut, BarChart3, User } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold">
            SAGE Admin
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link
            href="/admin/events"
            className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Events
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors"
          >
            <User className="w-5 h-5" />
            View Site
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-red-500 transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
