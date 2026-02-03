import { createClient } from '@/lib/supabase';
import EventForm from '@/components/EventForm';
import { notFound } from 'next/navigation';

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const supabase = createClient();

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (!event) {
    notFound();
  }

  // Ensure initialData matches what EventForm expects
  const initialData = {
    ...event,
    description: event.description || undefined,
    image_url: event.image_url || undefined,
    status: event.status as 'published' | 'draft',
    // date is already string from Supabase
  };

  return (
    <div>
      <h1 className="text-3xl font-black uppercase mb-8">Event bearbeiten</h1>
      <EventForm initialData={initialData} />
    </div>
  );
}
