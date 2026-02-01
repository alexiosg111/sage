import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Calendar } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default async function EventsPage() {
  const supabase = createClient();
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: true });

  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />
      
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Events</h1>
        <p className="text-zinc-400 mb-12 max-w-2xl">
          Discover our upcoming events and get your tickets for unforgettable nights at SAGE Club Berlin.
        </p>

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
                  {event.ticket_price && (
                    <p className="mt-4 text-lg font-semibold">
                      From {event.ticket_price.toFixed(2)} €
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <Calendar className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No events scheduled at the moment.</p>
            <p className="text-zinc-500 mt-2">Check back soon for upcoming events!</p>
          </div>
        )}
      </div>
    </main>
  );
}
