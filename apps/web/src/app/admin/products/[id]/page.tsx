'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
  status: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    status: 'active',
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        const response = await fetch(`/api/admin/products/${productId}`);
        if (!response.ok) throw new Error('Failed to load product');
        
        const product = await response.json();
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          price: product.price.toString(),
          stock: product.stock.toString(),
          image_url: product.image_url || '',
          status: product.status,
        });
      } catch (error) {
        console.error('Error loading product:', error);
        alert('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (!response.ok) throw new Error('Failed to update product');

      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-zinc-400 mb-2">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-zinc-400 mb-2">
                Price (€) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-zinc-400 mb-2">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Image
            </label>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              onUpload={handleImageUpload}
              disabled={isSubmitting || isUploading}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-zinc-400 mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Link
            href="/admin/products"
            className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-amber-500 text-zinc-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
