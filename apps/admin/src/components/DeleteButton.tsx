'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  id: string;
  table: 'products' | 'events';
  name: string;
}

export default function DeleteButton({ id, table, name }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const handleDelete = async () => {
    if (!confirm(`Möchtest du "${name}" wirklich löschen?`)) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Fehler beim Löschen.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-zinc-400 hover:text-red-600 transition-colors disabled:opacity-50"
      title="Löschen"
    >
      {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
    </button>
  );
}
