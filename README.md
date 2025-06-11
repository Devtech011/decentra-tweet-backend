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

## Database Management with Prisma

### Prisma Setup

1. Install Prisma CLI globally (if not already installed):
```bash
npm install -g prisma
```

2. Initialize Prisma in your project (if not already done):
```bash
npx prisma init
```

### Database Migrations

1. **Create a new migration**
```bash
# After making changes to your schema.prisma file
npx prisma migrate dev --name <migration-name>
```
Example:
```bash
npx prisma migrate dev --name add_user_profile
```

2. **Apply migrations to production**
```bash
npx prisma migrate deploy
```

3. **Reset database** (Warning: This will delete all data)
```bash
npx prisma migrate reset
```

4. **View migration history**
```bash
npx prisma migrate status
```

### Database Backup and Restore

1. **Create a database backup**
```bash
# Create a backup file
pg_dump -U postgres -d decentra_tweet -F c -f decentra_tweet_backup.dump
```

2. **Restore from backup**
```bash
# Restore from backup file
pg_restore -U postgres -d decentra_tweet -c decentra_tweet_backup.dump
```

### Prisma Studio

To view and manage your database through a GUI:
```bash
npx prisma studio
```
This will open Prisma Studio at `http://localhost:5555`

### Common Prisma Commands

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Format your schema.prisma file
npx prisma format

# Validate your schema.prisma file
npx prisma validate

# Push schema changes to database without migrations
npx prisma db push
```

### Database Schema

The application uses the following main tables (defined in `prisma/schema.prisma`):

```prisma
model User {
  id            Int       @id @default(autoincrement())
  wallet_address String   @unique
  username      String?
  profile_pic_url String?
  posts         Post[]
  comments      Comment[]
  likes         Like[]
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt
}

model Post {
  id            Int       @id @default(autoincrement())
  wallet_address String
  content       String
  timestamp     DateTime  @default(now())
  user          User      @relation(fields: [wallet_address], references: [wallet_address])
  comments      Comment[]
  likes         Like[]
}

model Comment {
  id            Int       @id @default(autoincrement())
  post_id       Int
  wallet_address String
  content       String
  timestamp     DateTime  @default(now())
  post          Post      @relation(fields: [post_id], references: [id])
  user          User      @relation(fields: [wallet_address], references: [wallet_address])
}

model Like {
  id            Int       @id @default(autoincrement())
  post_id       Int
  wallet_address String
  timestamp     DateTime  @default(now())
  post          Post      @relation(fields: [post_id], references: [id])
  user          User      @relation(fields: [wallet_address], references: [wallet_address])

  @@unique([post_id, wallet_address])
}
```

### Troubleshooting Database Issues

1. **Reset database and apply migrations**
```bash
npx prisma migrate reset --force
```

2. **Check database connection**
```bash
npx prisma db pull
```

3. **View database logs**
```bash
# For PostgreSQL
psql -U postgres -d decentra_tweet -c "SELECT * FROM pg_stat_activity;"
```

## Development

### Running Tests
```bash
npm run test
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
