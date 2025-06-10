# Decentra Tweet Backend

A decentralized Twitter-like backend built with NestJS, PostgreSQL, and Prisma. This application provides a RESTful API for a decentralized social media platform where users can post, comment, and interact using their Ethereum wallet addresses.

## Features

- 🔐 Ethereum wallet-based authentication
- 📝 Create, read, and delete posts
- 💬 Comment on posts
- ❤️ Like/unlike posts
- 👤 User profiles with usernames and profile pictures
- 📱 RESTful API with Swagger documentation

## Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM + Prisma
- **Authentication:** Ethereum wallet signature verification
- **API Documentation:** Swagger/OpenAPI

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/decentra_tweet"
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=decentra_tweet

# JWT (if needed)
JWT_SECRET=your_jwt_secret
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd decentra-tweet-backend
```

2. Install dependencies:
```bash
npm install
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run start:dev
```

The server will start at `http://localhost:3000`

## API Documentation

Once the server is running, you can access the Swagger documentation at `http://localhost:3000/api`

### Main Endpoints

#### Authentication
- `POST /auth/verify-signature` - Verify wallet signature and create/update user

#### Posts
- `GET /posts` - Get feed of posts (with pagination)
- `POST /posts` - Create a new post
- `GET /posts/:id` - Get post details
- `DELETE /posts/:id` - Delete a post
- `POST /posts/:id/like` - Like a post
- `DELETE /posts/:id/like` - Unlike a post
- `GET /posts/:id/likes` - Get post likes

#### Comments
- `POST /posts/:id/comments` - Add a comment to a post
- `GET /posts/:id/comments` - Get comments for a post
- `DELETE /comments/:id` - Delete a comment

### Example API Usage

1. **Create a Post**
```bash
POST /posts
{
  "wallet_address": "0x...",
  "content": "Hello, Decentra Tweet!"
}
```

2. **Add a Comment**
```bash
POST /posts/:id/comments
{
  "wallet_address": "0x...",
  "content": "Great post!"
}
```

3. **Like a Post**
```bash
POST /posts/:id/like
{
  "wallet_address": "0x..."
}
```

## Database Schema

The application uses the following main tables:

- `users` - User profiles
- `posts` - User posts
- `comments` - Post comments
- `likes` - Post likes

## Development

### Running Tests
```bash
npm run test
```

### Database Migrations
```bash
# Create a new migration
npx prisma migrate dev --name <migration-name>

# Apply migrations
npx prisma migrate deploy
```

### Code Generation
```bash
# Generate Prisma Client
npx prisma generate
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
