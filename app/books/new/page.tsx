import BookForm from '@/app/components/BookForm';

export default function NewBook() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Book</h1>
      <BookForm />
    </div>
  );
} 