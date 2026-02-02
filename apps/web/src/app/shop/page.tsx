import { createClient } from '@/lib/supabase';
import Navigation from '@/components/Navigation';
import ShopSection from '@/components/ShopSection';
import { UnifiedProduct } from '@/types';

export default async function ShopPage() {
  const supabase = createClient();
  
  // Fetch upcoming events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: true });

  // Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  // Map to unified product format for ShopSection
  const unifiedProducts: UnifiedProduct[] = [
    ...(events || []).map(event => ({
      id: event.id,
      name: event.name,
      price: event.ticket_price || 0,
      image_url: event.image_url || '',
      category: 'ticket' as const,
      date: event.date,
      stock: event.ticket_stock,
      description: event.description || '',
    })),
    ...(products || []).map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || '',
      category: 'merch' as const,
      stock: product.stock,
      description: product.description || '',
    }))
  ];

  return (
    <main className="min-h-screen pt-20">
      <Navigation />
      <ShopSection initialProducts={unifiedProducts} />
    </main>
  );
}
