'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { useState } from 'react';

export default function Navigation() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop & Tickets' },
    { href: '/club', label: 'Club' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-md z-[1000] border-b border-[#333333] py-4">
      <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="logo text-2xl font-black tracking-tighter">
          SAGE CLUB
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Cart & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link href="/shop/cart" className="cart-btn relative px-4 py-2 border border-[#333333] font-mono text-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
            Warenkorb (<span id="cart-count">{totalItems}</span>)
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--accent)] text-black text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-[#333333] mt-4 px-6 py-4">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 hover:text-[var(--accent)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
