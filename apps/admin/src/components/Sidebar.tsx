'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  ShoppingBag, 
  Settings,
  LogOut
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Produkte', icon: Package },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/orders', label: 'Bestellungen', icon: ShoppingBag },
  { href: '/settings', label: 'Einstellungen', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-zinc-950 text-white min-h-screen flex flex-col border-r border-zinc-800">
      <div className="p-6">
        <h1 className="text-xl font-black tracking-tighter">SAGE <span className="text-primary">ADMIN</span></h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-black font-bold' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors w-full">
          <LogOut className="w-5 h-5" />
          Abmelden
        </button>
      </div>
    </div>
  );
}
