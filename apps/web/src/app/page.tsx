import { createClient } from '@/lib/supabase';
import Navigation from '@/components/Navigation';
import ShopSection from '@/components/ShopSection';
import Link from 'next/link';
import Image from 'next/image';
import { UnifiedProduct } from '@/types';

export default async function Home() {
  const supabase = createClient();
  
  // Fetch upcoming events
  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: true });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const events = eventsData as any[] | null;

  // Fetch products
  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = productsData as any[] | null;

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
    <main className="min-h-screen">
      <Navigation />

      {/* HERO SECTION */}
      <section id="hero" className="h-[90vh] flex items-center justify-center relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-full z-[-1] grayscale contrast-[1.2]">
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-[#0a0a0a] z-10" />
            <Image 
                src="https://picsum.photos/seed/techno/1920/1080" 
                alt="Club atmosphere" 
                fill
                className="object-cover"
                priority
            />
        </div>
        <div className="z-10 px-8 py-12 border border-white/10 bg-black/40 backdrop-blur-md max-w-4xl mx-auto">
            <p className="mono">Berlin Institution</p>
            <h1 className="text-[clamp(3rem,10vw,8rem)] leading-[0.9] font-black uppercase mb-4 tracking-tighter">
                THE HEART<br />OF TECHNO
            </h1>
            <p className="mt-4 text-[#ddd] text-lg">Köpenicker Str. 173, Berlin</p>
            <Link href="#shop" className="inline-block bg-[var(--accent)] text-black px-8 py-4 font-bold uppercase mt-8 hover:bg-[var(--accent-hover)] hover:scale-105 transition-all">
                Tickets & Merch
            </Link>
        </div>
      </section>

      {/* SHOP SECTION */}
      <ShopSection initialProducts={unifiedProducts} />

      {/* ABOUT / INFO SECTION */}
      <section id="about" className="py-24 border-b border-[#333333]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="info-image relative aspect-[3/2]">
                <Image src="https://picsum.photos/seed/clubinterior/600/400" alt="Sage Club Interior" fill className="rounded-[4px] object-cover" />
            </div>
            <div className="info-text">
                <div className="mono mb-2">Der Ort</div>
                <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 leading-tight">Industrielles Erbe</h2>
                <p className="text-[#888] mb-6 text-lg">
                    Der Sage Club ist einer der letzten authentischen Techno-Clubs Berlins, gelegen in einem ehemaligen Heizkraftwerk in Köpenick. Die rohe Industriearchitektur bietet den perfekten Rahmen für ungefilterte Musik- und Partyerlebnisse.
                </p>
                <p className="text-[#888] mb-8 text-lg">
                    Unser Ziel war es, diese rohe Ästhetik auch digital einfangen – ohne unnötigen Schnickschnack, sondern mit Fokus auf das Wesentliche: Musik, Atmosphäre und Community.
                </p>
                <Link href="#" className="inline-block border-b border-[var(--accent)] pb-1 text-white hover:text-[var(--accent)] transition-colors">
                    Kontakt & Anfahrt
                </Link>
            </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex justify-center gap-8 mb-8">
                <Link href="#" className="text-[#888] text-sm hover:text-white transition-colors">Impressum</Link>
                <Link href="#" className="text-[#888] text-sm hover:text-white transition-colors">Datenschutz</Link>
                <Link href="#" className="text-[#888] text-sm hover:text-white transition-colors">Jobs</Link>
                <Link href="#" className="text-[#888] text-sm hover:text-white transition-colors">Presse</Link>
                <Link href="/admin" className="text-[#333] text-sm hover:text-[var(--accent)] transition-colors">Admin</Link>
            </div>
            <p className="mono text-[#444] text-xs">© {new Date().getFullYear()} SAGE CLUB BERLIN</p>
        </div>
      </footer>
    </main>
  );
}
