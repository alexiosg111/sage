import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default async function ProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase">Produkte</h1>
        <Link 
          href="/products/new" 
          className="bg-black text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-5 h-5 text-[var(--primary)]" />
          Produkt hinzufügen
        </Link>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Bild</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Name</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Kategorie</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Preis</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Bestand</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Status</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded overflow-hidden">
                    {product.image_url && <img src={product.image_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold">{product.name}</td>
                <td className="px-6 py-4 text-zinc-500">Merch</td>
                <td className="px-6 py-4 font-mono">{product.price.toFixed(2)} €</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                  Keine Produkte gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
