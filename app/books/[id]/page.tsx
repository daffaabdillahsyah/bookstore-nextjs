'use client';

import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';

const defaultImage = "https://via.placeholder.com/400x600?text=No+Image";

export default async function BookDetail({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const book = await prisma.book.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!book) {
    notFound();
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`/api/books/${params.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete book');
        }

        router.push('/');
        router.refresh();
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  const handleBuy = () => {
    const params = new URLSearchParams({
      title: book.title,
      price: book.price.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Books
          </Link>
          <div className="flex gap-4">
            <button
              onClick={handleBuy}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Buy Now
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete Book
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={book.imageUrl || defaultImage}
                alt={book.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">by {book.author}</p>
              </div>

              <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
                <p className="text-3xl text-green-600 dark:text-green-400 font-bold">
                  ${book.price.toFixed(2)}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {book.description || 'No description available.'}
                </p>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Added on {new Date(book.createdAt).toLocaleDateString()}</p>
                <p>Last updated {new Date(book.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 