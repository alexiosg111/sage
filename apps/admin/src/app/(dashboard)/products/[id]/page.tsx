import { createClient } from '@/lib/supabase';
import ProductForm from '@/components/ProductForm';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  // Ensure initialData matches what ProductForm expects
  const initialData = {
    ...product,
    description: product.description || undefined,
    image_url: product.image_url || undefined,
    status: product.status as 'active' | 'inactive',
  };

  return (
    <div>
      <h1 className="text-3xl font-black uppercase mb-8">Produkt bearbeiten</h1>
      <ProductForm initialData={initialData} />
    </div>
  );
}
