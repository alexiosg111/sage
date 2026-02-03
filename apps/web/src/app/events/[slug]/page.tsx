'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Calendar, MapPin, Ticket, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import BuyTicketButton from '@/components/BuyTicketButton';
import Image from 'next/image';

interface Event {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  date: string;
  ticket_price: number | null;
  ticket_stock: number;
  image_url: string | null;
  status: string;
}

export default function EventPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;
      
      const supabase = createClient();
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      setEvent(data);
      setIsLoading(false);
    };

    fetchEvent();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="py-40 px-6 text-center">
          <p className="mono animate-pulse">Lade Event...</p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="py-40 px-6 text-center">
          <div className="mono mb-4 text-red-500">404</div>
          <h1 className="text-4xl font-black uppercase mb-8">Event nicht gefunden</h1>
          <Link href="/events" className="inline-block border-b border-[var(--accent)] text-white hover:text-[var(--accent)] transition-colors">
            Zurück zum Programm
          </Link>
        </div>
      </main>
    );
  }

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= new Date(new Date().toISOString().split('T')[0]);
  const hasTickets = event.ticket_stock > 0;

  return (
    <main className="min-h-screen pt-20">
      <Navigation />
      
      <div className="py-12 px-6 max-w-[1200px] mx-auto">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 mono text-xs text-[#888] hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          ZURÜCK ZUM PROGRAMM
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div className="aspect-square bg-black border border-[#333333] relative overflow-hidden">
            {event.image_url ? (
              <Image
                src={event.image_url}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="w-24 h-24 text-[#333]" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-12">
              <p className="mono text-[var(--accent)] mb-4">
                {eventDate.toLocaleDateString('de-DE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              
              <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 tracking-tighter leading-tight">{event.name}</h1>
              
              <div className="flex items-center gap-2 text-[#888] mono text-sm mb-8">
                <MapPin className="w-4 h-4 text-[var(--accent)]" />
                <span>SAGE CLUB BERLIN | KÖPENICKER STR. 173</span>
              </div>

              {event.description && (
                <div className="border-t border-[#333333] pt-8">
                  <p className="text-[#888] leading-relaxed text-lg whitespace-pre-wrap">{event.description}</p>
                </div>
              )}
            </div>

            {/* Ticket Section */}
            {event.ticket_price && isUpcoming && (
              <div className="bg-[#141414] border border-[#333333] p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                        <Ticket className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="font-bold uppercase">Standard Ticket</p>
                      <p className="mono text-xs text-[#555]">
                        {hasTickets ? `${event.ticket_stock} TICKETS VERFÜGBAR` : 'AUSVERKAUFT'}
                      </p>
                    </div>
                  </div>
                  <p className="text-3xl font-black font-mono text-[var(--accent)]">{event.ticket_price.toFixed(2)} €</p>
                </div>
                
                {hasTickets ? (
                  <BuyTicketButton 
                    eventId={event.id} 
                    eventName={event.name}
                    ticketPrice={event.ticket_price}
                  />
                ) : (
                  <button
                    disabled
                    className="w-full py-4 border border-[#333333] text-[#444] font-bold uppercase cursor-not-allowed"
                  >
                    Sold Out
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
