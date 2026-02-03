'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUpload?: (file: File) => Promise<string>;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, onUpload, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (imageFile) {
      await handleFileUpload(imageFile);
    }
  }, [disabled]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && !disabled) {
      await handleFileUpload(files[0]);
    }
  }, [disabled]);

  const handleFileUpload = async (file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = '';

      if (onUpload) {
        imageUrl = await onUpload(file);
      } else {
        // Default: create object URL for preview
        imageUrl = URL.createObjectURL(file);
      }

      setPreview(imageUrl);
      onChange(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (disabled) return;
    setPreview('');
    onChange('');
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative group">
          <div className="aspect-video w-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            aspect-video w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer
            ${isDragging ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-700 hover:border-zinc-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
            {isUploading ? (
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
            ) : (
              <>
                <Upload className="w-12 h-12 text-zinc-500 mb-4" />
                <p className="text-sm text-zinc-400 font-medium">
                  {isDragging ? 'Drop image here' : 'Upload image'}
                </p>
                <p className="text-xs text-zinc-500 mt-2">
                  Drag and drop or click to select
                </p>
              </>
            )}
          </label>
        </div>
      )}

      <div className="relative">
        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="url"
          value={value || ''}
          onChange={handleUrlChange}
          disabled={disabled}
          placeholder="Or paste image URL..."
          className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
        />
      </div>

      <p className="text-xs text-zinc-500">
        Supports JPG, PNG, GIF, WEBP (max 5MB)
      </p>
    </div>
  );
}
