'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  price: number;
  imageUrl?: string;
}

export default function BookCard({ id, title, author, price, imageUrl }: BookCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const defaultImage = "https://via.placeholder.com/400x600?text=No+Image";

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete book');
        }

        router.refresh();
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  const handleBuy = () => {
    const params = new URLSearchParams({
      title: title,
      price: price.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl || defaultImage}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <Link href={`/books/${id}`}>
          <h3 className="text-lg font-semibold hover:text-blue-600 mb-2">{title}</h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-400">{author}</p>
        <p className="text-green-600 dark:text-green-400 font-semibold mt-2">${price.toFixed(2)}</p>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handleBuy}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm font-medium"
          >
            Buy Now
          </button>
          {session?.user?.role === 'ADMIN' && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 