'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(2, 'Name ist erforderlich'),
  description: z.string().optional(),
  price: z.number().min(0, 'Preis muss positiv sein'),
  stock: z.number().int().min(0, 'Bestand muss positiv sein'),
  image_url: z.string().url('Ungültige URL').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: ProductFormValues & { id: string };
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      status: 'active',
      price: 0,
      stock: 0,
    },
  });

  const imageUrl = watch('image_url');

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const productData = {
        name: data.name,
        description: data.description || null,
        price: data.price,
        stock: data.stock,
        image_url: data.image_url || null,
        status: data.status,
        slug,
      };
      
      if (initialData) {
        const { error } = await supabase
          .from('products')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .update(productData as any)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert([productData as any]);
        if (error) throw error;
      }

      router.push('/products');
      router.refresh();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Fehler beim Speichern des Produkts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-8 border border-zinc-200 rounded-xl shadow-sm">
      <div>
        <label className="block text-sm font-bold uppercase mb-2">Name</label>
        <input
          {...register('name')}
          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all"
          placeholder="z.B. Sage Club Hoodie"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-2">Beschreibung</label>
        <textarea
          {...register('description')}
          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all h-32"
          placeholder="Details zum Produkt..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold uppercase mb-2">Preis (€)</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all font-mono"
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-2">Bestand</label>
          <input
            type="number"
            {...register('stock', { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all"
          />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-2">Bild URL</label>
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
          <option value="active">Aktiv</option>
          <option value="inactive">Inaktiv</option>
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
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Speichern'}
        </button>
      </div>
    </form>
  );
}
