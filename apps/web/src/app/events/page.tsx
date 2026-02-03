import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Calendar, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';

export default async function EventsPage() {
  const supabase = createClient();
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: true });

  return (
    <main className="min-h-screen pt-20">
      <Navigation />
      
      <div className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="mono mb-4">Programm</div>
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-12 tracking-tighter">Nächste Events</h1>
        
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group block bg-[#141414] border border-[#333333] hover:border-[var(--accent)] transition-all h-full flex flex-col"
              >
                <div className="aspect-video bg-black relative overflow-hidden">
                  {event.image_url ? (
                    <Image
                      src={event.image_url}
                      alt={event.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-[#333]" />
                    </div>
                  )}
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <p className="mono text-xs mb-4">
                    {new Date(event.date).toLocaleDateString('de-DE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <h3 className="text-2xl font-bold uppercase mb-4 leading-tight group-hover:text-[var(--accent)] transition-colors">
                    {event.name}
                  </h3>
                  {event.description && (
                    <p className="text-[#888] line-clamp-2 mb-6 text-sm">{event.description}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between">
                    {event.ticket_price && (
                      <p className="font-mono font-bold text-lg text-[var(--accent)]">
                        {event.ticket_price.toFixed(2)} €
                      </p>
                    )}
                    <div className="flex items-center gap-2 uppercase text-xs font-bold tracking-widest group-hover:translate-x-2 transition-transform">
                      Details <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-[#333333] bg-[#141414]">
            <Calendar className="w-16 h-16 text-[#333] mx-auto mb-6" />
            <p className="text-[#888] text-lg mb-2 uppercase font-black">Keine Events geplant</p>
            <p className="text-[#444] text-sm">Schau bald wieder vorbei für neue Termine.</p>
          </div>
        )}
      </div>
    </main>
  );
}
