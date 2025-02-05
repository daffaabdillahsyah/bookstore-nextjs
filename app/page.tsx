import Link from 'next/link';
import BookCard from './components/BookCard';
import SearchBar from './components/SearchBar';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { Suspense } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  imageUrl?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  try {
    const session = await getServerSession(authOptions);
    const searchQuery = Array.isArray(searchParams.q) 
      ? searchParams.q[0] 
      : searchParams.q || '';

    const books = await prisma.book.findMany({
      where: searchQuery ? {
        OR: [
          { title: { contains: searchQuery } },
          { author: { contains: searchQuery } },
          { description: { contains: searchQuery } },
        ],
      } : undefined,
      orderBy: {
        createdAt: 'desc'
      }
    }).catch(error => {
      console.error('Error fetching books:', error);
      return [];
    });

    return (
      <div className="min-h-screen p-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Bookstore</h1>
            {session?.user?.role === 'ADMIN' && (
              <Link 
                href="/books/new" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add New Book
              </Link>
            )}
          </div>
          <Suspense fallback={<div>Loading search...</div>}>
            <SearchBar />
          </Suspense>
        </header>

        <Suspense fallback={<div>Loading books...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book: Book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                price={book.price}
                imageUrl={book.imageUrl}
              />
            ))}
          </div>

          {books.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              {searchQuery ? 'No books found matching your search.' : 'No books available. Add some books to get started!'}
            </p>
          )}
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error in Home page:', error);
    return (
      <div className="min-h-screen p-8">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Sorry, something went wrong. Please try again later.</p>
        </div>
      </div>
    );
  }
}
