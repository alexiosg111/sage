'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const eventSchema = z.object({
  name: z.string().min(2, 'Name ist erforderlich'),
  description: z.string().optional(),
  date: z.string().min(1, 'Datum ist erforderlich'),
  ticket_price: z.number().min(0, 'Preis muss positiv sein'),
  ticket_stock: z.number().int().min(0, 'Bestand muss positiv sein'),
  image_url: z.string().url('Ungültige URL').optional().or(z.literal('')),
  status: z.enum(['published', 'draft']),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: EventFormValues & { id: string };
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      status: 'draft',
      ticket_price: 0,
      ticket_stock: 0,
      date: new Date().toISOString().slice(0, 16),
    },
  });

  const imageUrl = watch('image_url');

  const onSubmit = async (data: EventFormValues) => {
    setLoading(true);
    try {
      const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const eventData = {
        name: data.name,
        description: data.description || null,
        date: data.date,
        ticket_price: data.ticket_price,
        ticket_stock: data.ticket_stock,
        image_url: data.image_url || null,
        status: data.status,
        slug,
      };
      
      if (initialData) {
        const { error } = await supabase
          .from('events')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .update(eventData as any)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert([eventData as any]);
        if (error) throw error;
      }

      router.push('/events');
      router.refresh();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Fehler beim Speichern des Events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-8 border border-zinc-200 rounded-xl shadow-sm">
      <div>
        <label className="block text-sm font-bold uppercase mb-2">Event Name</label>
        <input
          {...register('name')}
          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all"
          placeholder="z.B. Sage Friday Night"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-2">Beschreibung</label>
        <textarea
          {...register('description')}
          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all h-32"
          placeholder="Lineup, Info..."
        />
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-2">Datum & Zeit</label>
        <input
          type="datetime-local"
          {...register('date')}
          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all font-mono"
        />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold uppercase mb-2">Ticket Preis (€)</label>
          <input
            type="number"
            step="0.01"
            {...register('ticket_price', { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all font-mono"
          />
          {errors.ticket_price && <p className="text-red-500 text-xs mt-1">{errors.ticket_price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-2">Tickets Verfügbar</label>
          <input
            type="number"
            {...register('ticket_stock', { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all"
          />
          {errors.ticket_stock && <p className="text-red-500 text-xs mt-1">{errors.ticket_stock.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-2">Flyer/Bild URL</label>
        <div className="flex gap-4">
          <input
            {...register('image_url')}
            className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all"
            placeholder="https://..."
          />
          {imageUrl && (
            <div className="w-12 h-12 relative border border-zinc-200 rounded overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-2">Status</label>
        <select
          {...register('status')}
          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all"
        >
          <option value="draft">Entwurf</option>
          <option value="published">Veröffentlicht</option>
        </select>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-4 border border-zinc-200 font-bold uppercase rounded-lg hover:bg-zinc-50 transition-all"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-4 bg-black text-white font-bold uppercase rounded-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Event Speichern'}
        </button>
      </div>
    </form>
  );
}
