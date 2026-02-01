import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Calendar, ShoppingBag, ArrowRight } from 'lucide-react';

export default async function Home() {
  const supabase = createClient();
  
  // Fetch upcoming events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(3);

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950" />
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
            SAGE CLUB
            <span className="block text-amber-500">BERLIN</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Experience the finest electronic music events and exclusive merchandise in the heart of Berlin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-zinc-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              View Events
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Visit Shop
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <Link href="/events" className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors">
            All Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group block bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all"
              >
                <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                      <Calendar className="w-12 h-12 text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-amber-500 text-sm font-medium mb-2">
                    {new Date(event.date).toLocaleDateString('de-DE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-500 transition-colors">
                    {event.name}
                  </h3>
                  {event.description && (
                    <p className="text-zinc-400 line-clamp-2">{event.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">No upcoming events at the moment.</p>
          </div>
        )}
      </section>

      {/* Shop CTA Section */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Official Merchandise</h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            Show your love for SAGE Club with our exclusive merchandise collection. From t-shirts to accessories.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-zinc-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
