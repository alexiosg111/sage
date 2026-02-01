import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase';
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react';

export default async function AdminEventsPage() {
  const supabase = createServiceClient();
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Event
        </Link>
      </div>

      {events && events.length > 0 ? (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-800/50">
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Event</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Ticket Price</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Stock</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-t border-zinc-800">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                          {event.image_url ? (
                            <img
                              src={event.image_url}
                              alt={event.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Calendar className="w-6 h-6 text-zinc-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{event.name}</p>
                          <p className="text-sm text-zinc-400">{event.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(event.date).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4">
                      {event.ticket_price ? `${event.ticket_price.toFixed(2)} €` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`${
                          event.ticket_stock === 0
                            ? 'text-red-500'
                            : event.ticket_stock <= 10
                            ? 'text-amber-500'
                            : 'text-green-500'
                        }`}
                      >
                        {event.ticket_stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'published'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-zinc-700 text-zinc-400'
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <form action={`/api/admin/events/${event.id}/delete`} method="POST">
                          <button
                            type="submit"
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <Calendar className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg mb-4">No events yet</p>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create your first event
          </Link>
        </div>
      )}
    </div>
  );
}
