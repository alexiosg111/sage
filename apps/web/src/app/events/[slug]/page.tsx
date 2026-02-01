'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Calendar, MapPin, Ticket, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import BuyTicketButton from '@/components/BuyTicketButton';

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
      <main className="min-h-screen bg-zinc-950">
        <Navigation />
        <div className="py-20 px-4 text-center">
          <p className="text-zinc-400">Loading...</p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-zinc-950">
        <Navigation />
        <div className="py-20 px-4 text-center">
          <p className="text-zinc-400">Event not found</p>
          <Link href="/events" className="text-amber-500 hover:underline mt-4 inline-block">
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= new Date(new Date().toISOString().split('T')[0]);
  const hasTickets = event.ticket_stock > 0;

  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
            {event.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.image_url}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                <Calendar className="w-24 h-24 text-zinc-600" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex-1">
              <p className="text-amber-500 font-medium mb-4">
                {eventDate.toLocaleDateString('de-DE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              
              <h1 className="text-4xl font-bold mb-6">{event.name}</h1>
              
              <div className="flex items-center gap-2 text-zinc-400 mb-6">
                <MapPin className="w-5 h-5" />
                <span>SAGE Club Berlin</span>
              </div>

              {event.description && (
                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-zinc-300 leading-relaxed">{event.description}</p>
                </div>
              )}
            </div>

            {/* Ticket Section */}
            {event.ticket_price && isUpcoming && (
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Ticket className="w-6 h-6 text-amber-500" />
                    <div>
                      <p className="font-semibold">Standard Ticket</p>
                      <p className="text-sm text-zinc-400">
                        {hasTickets ? `${event.ticket_stock} tickets available` : 'Sold out'}
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{event.ticket_price.toFixed(2)} €</p>
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
                    className="w-full py-3 bg-zinc-800 text-zinc-500 font-semibold rounded-lg cursor-not-allowed"
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
