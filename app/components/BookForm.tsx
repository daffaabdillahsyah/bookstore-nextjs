'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BookFormData {
  title: string;
  author: string;
  price: string;
  description: string;
  imageUrl: string;
}

interface FormError {
  field: string;
  message: string;
}

const defaultImage = "https://via.placeholder.com/400x600?text=No+Image";

export default function BookForm({ book }: { book?: BookFormData }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormError[]>([]);
  const [formData, setFormData] = useState<BookFormData>({
    title: book?.title || '',
    author: book?.author || '',
    price: book?.price || '',
    description: book?.description || '',
    imageUrl: book?.imageUrl || defaultImage,
  });

  const validateForm = (): boolean => {
    const newErrors: FormError[] = [];

    if (!formData.title.trim()) {
      newErrors.push({ field: 'title', message: 'Title is required' });
    }

    if (!formData.author.trim()) {
      newErrors.push({ field: 'author', message: 'Author is required' });
    }

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.push({ field: 'price', message: 'Price must be a positive number' });
    }

    if (formData.imageUrl && !formData.imageUrl.startsWith('https://')) {
      newErrors.push({ field: 'imageUrl', message: 'Image URL must be HTTPS' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save book');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error saving book:', error);
      setErrors([{ field: 'submit', message: error instanceof Error ? error.message : 'Failed to save book' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: string): string => {
    const error = errors.find(e => e.field === fieldName);
    return error ? error.message : '';
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {errors.some(e => e.field === 'submit') && (
        <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-700 rounded">
          <p>{getFieldError('submit')}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              getFieldError('title') ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            minLength={2}
            maxLength={255}
          />
          {getFieldError('title') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('title')}</p>
          )}
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Author *
          </label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              getFieldError('author') ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            minLength={2}
            maxLength={255}
          />
          {getFieldError('author') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('author')}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                getFieldError('price') ? 'border-red-500' : 'border-gray-300'
              }`}
              step="0.01"
              min="0"
              required
            />
          </div>
          {getFieldError('price') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('price')}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              getFieldError('imageUrl') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://..."
          />
          {getFieldError('imageUrl') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('imageUrl')}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">Leave empty to use default cover image</p>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Book'}
          </button>
        </div>
      </div>
    </form>
  );
} 