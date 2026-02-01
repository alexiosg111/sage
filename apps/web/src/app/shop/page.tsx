import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Package } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default async function ShopPage() {
  const supabase = createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />
      
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Shop</h1>
        <p className="text-zinc-400 mb-12 max-w-2xl">
          Official SAGE Club merchandise and accessories. Support your favorite club and look good doing it.
        </p>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/products/${product.slug}`}
                className="group block bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all"
              >
                <div className="aspect-square bg-zinc-800 relative overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                      <Package className="w-12 h-12 text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 group-hover:text-amber-500 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">{product.price.toFixed(2)} €</p>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="text-xs text-amber-500">Only {product.stock} left</span>
                    )}
                    {product.stock === 0 && (
                      <span className="text-xs text-zinc-500">Sold out</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <Package className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No products available at the moment.</p>
            <p className="text-zinc-500 mt-2">Check back soon for new merchandise!</p>
          </div>
        )}
      </div>
    </main>
  );
}
