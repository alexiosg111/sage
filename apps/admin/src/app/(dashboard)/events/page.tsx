import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Event } from '@/types';

export default async function EventsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  
  const events = data as Event[] | null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase">Events (Tickets)</h1>
        <Link 
          href="/events/new" 
          className="bg-black text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-5 h-5 text-[var(--primary)]" />
          Event hinzufügen
        </Link>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Datum</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Name</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Preis</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Verfügbar</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">Status</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {events?.map((event) => (
              <tr key={event.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm">
                  {new Date(event.date).toLocaleDateString('de-DE')}
                </td>
                <td className="px-6 py-4 font-bold">{event.name}</td>
                <td className="px-6 py-4 font-mono">{event.ticket_price?.toFixed(2)} €</td>
                <td className="px-6 py-4">{event.ticket_stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    event.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'
                  }`}>
                    {event.status}
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
            {(!events || events.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  Keine Events gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
