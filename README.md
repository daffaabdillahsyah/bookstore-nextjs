# Bookstore Web Application

A modern web application for an online bookstore built with Next.js, TypeScript, and Prisma.

## Features

- 📚 Book browsing and searching
- 🛒 Shopping cart functionality
- 👤 User authentication (Admin and Regular users)
- 💳 Checkout process
- 🎨 Responsive design with dark mode support
- 🔐 Role-based access control

## Tech Stack

- **Frontend:**
  - Next.js 13+ (App Router)
  - TypeScript
  - Tailwind CSS
  - NextAuth.js for authentication

- **Backend:**
  - Prisma ORM
  - MySQL Database
  - Next.js API Routes

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MySQL Server
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd bookstore-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```env
DATABASE_URL="mysql://root:123456@localhost:3306/bookstore"
NEXTAUTH_SECRET="bookstore-secret-key-2024-secure"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database and seed initial data:
```bash
npx prisma migrate reset --force
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Default Users

The seed script creates two default users:

1. Admin User:
   - Email: admin@bookstore.com
   - Password: admin123

2. Regular User:
   - Email: user@bookstore.com
   - Password: user123

## Project Structure

```
bookstore-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── components/        # Reusable components
│   └── ...               # Other app routes
├── prisma/                # Prisma schema and migrations
├── public/                # Static files
├── types/                 # TypeScript type definitions
└── ...                   # Config files
```

## Features in Detail

### User Roles
- **Admin Users:**
  - Add new books
  - Edit existing books
  - Delete books
  - Access admin dashboard

- **Regular Users:**
  - Browse books
  - Search for books
  - Purchase books
  - View order history

### Book Management
- Create, read, update, and delete books
- Search functionality
- Image upload support
- Price management

### Shopping Experience
- Intuitive book browsing
- Shopping cart functionality
- Secure checkout process
- Order confirmation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- NextAuth.js for authentication capabilities
