'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { UnifiedProduct } from '@/types';

interface ShopSectionProps {
  initialProducts: UnifiedProduct[];
}

export default function ShopSection({ initialProducts }: ShopSectionProps) {
  const [filter, setFilter] = useState<'all' | 'ticket' | 'merch'>('all');
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const addItem = useCartStore((state) => state.addItem);

  const filteredProducts = initialProducts.filter(p => filter === 'all' || p.category === filter);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
    showToast(`${product.name} hinzugefügt!`);
  };

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  return (
    <section id="shop" className="py-24 border-b border-[#333333]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mono mb-4">Official Store</div>
        <h2 className="text-4xl md:text-6xl font-black mb-12">Tickets & Merchandise</h2>
        
        {/* Filters */}
        <div className="flex gap-4 mb-12 flex-wrap">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2 border font-mono transition-all ${filter === 'all' ? 'border-[var(--accent)] text-white' : 'border-[#333333] text-[#888888] hover:text-white'}`}
          >
            Alle
          </button>
          <button 
            onClick={() => setFilter('ticket')}
            className={`px-6 py-2 border font-mono transition-all ${filter === 'ticket' ? 'border-[var(--accent)] text-white' : 'border-[#333333] text-[#888888] hover:text-white'}`}
          >
            Tickets
          </button>
          <button 
            onClick={() => setFilter('merch')}
            className={`px-6 py-2 border font-mono transition-all ${filter === 'merch' ? 'border-[var(--accent)] text-white' : 'border-[#333333] text-[#888888] hover:text-white'}`}
          >
            Merch
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <article key={product.id} className="bg-[#141414] border border-[#333333] group hover:border-[var(--accent)] transition-all flex flex-direction-column relative h-full">
              {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                <span className="absolute top-2.5 right-2.5 bg-[var(--accent)] text-black px-2 py-1 text-[10px] font-bold uppercase z-10">
                  Selling Fast
                </span>
              )}
              {product.stock === 0 && (
                <span className="absolute top-2.5 right-2.5 bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase z-10">
                  Ausverkauft
                </span>
              )}
              
              <div className="h-[250px] w-full overflow-hidden relative">
                <img 
                  src={product.image_url || '/placeholder.jpg'} 
                  alt={product.name} 
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${product.stock === 0 ? 'grayscale' : ''}`}
                />
              </div>
              
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl font-bold ${product.stock === 0 ? 'text-[#555]' : ''}`}>{product.name}</h3>
                    <span className={`font-mono font-bold ${product.stock === 0 ? 'text-[#555]' : 'text-[var(--accent)]'}`}>
                      {product.price.toFixed(2)} €
                    </span>
                  </div>
                  
                  {product.category === 'ticket' ? (
                    <p className="text-sm text-[#888] mb-4">
                      {product.date ? new Date(product.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Demnächst'} | {product.date ? new Date(product.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '23:00'} Uhr<br />
                      Lineup: {product.lineup || 'TBA'}
                    </p>
                  ) : (
                    <p className="text-sm text-[#888] mb-4">
                      {product.description || 'Premium Quality Merch'}
                    </p>
                  )}
                </div>

                <button 
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-4 border font-bold uppercase transition-all mt-auto ${
                    product.stock === 0 
                    ? 'border-[#333] text-[#555] cursor-not-allowed' 
                    : 'border-white text-white hover:bg-white hover:text-black'
                  }`}
                >
                  {product.stock === 0 ? 'Sold Out' : (product.category === 'ticket' ? 'Ticket hinzufügen' : 'In den Warenkorb')}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* TOAST */}
      <div className={`fixed bottom-8 right-8 bg-[var(--accent)] text-black px-6 py-4 font-bold shadow-2xl transition-all duration-300 z-[1001] ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 pointer-events-none'}`}>
        {toast.message}
      </div>
    </section>
  );
}
