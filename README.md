# DecentraTweet Backend

The backend service for DecentraTweet, a decentralized social media platform. This service handles wallet authentication, user management, and post interactions through a RESTful API.

## 🚀 Technologies Used

- **NestJS** - Progressive Node.js framework for building efficient and scalable server-side applications
- **TypeScript** - Programming language for type-safe development
- **TypeORM** - ORM for database operations with PostgreSQL
- **PostgreSQL** - Relational database for data persistence
- **ethers.js** - Ethereum library for wallet interactions and signature verification
- **class-validator** - Data validation and transformation
- **@nestjs/swagger** - API documentation and testing interface

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd decentra-tweet-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=decentra_tweet

   # Environment
   NODE_ENV=development
   ```

4. Create the database:
   ```bash
   createdb decentra_tweet
   ```

5. Start the development server:
   ```bash
   npm run start:dev
   ```

The server will start at `http://localhost:3001`

## 📖 API Documentation

Once the server is running, you can access the Swagger documentation at:
`http://localhost:3001/api`

### Available Endpoints

#### Authentication
- `POST /auth/verify`
  - Verify wallet signature
  - Body: `{ wallet_address, signature, message }`
  - Returns: `{ valid, wallet_address, message, recovered_address, is_registered }`

#### Users
- `GET /users/:wallet`
  - Get user profile
  - Returns: `{ wallet_address, username, bio, profile_pic_url, created_at }`
- `POST /users`
  - Create/Update user profile
  - Body: `{ wallet_address, username?, bio?, profile_pic_url? }`

#### Posts
- `GET /posts`
  - Get feed of posts
- `POST /posts`
  - Create new post
  - Body: `{ wallet_address, content }`
- `GET /posts/:id`
  - Get post details
- `POST /posts/:id/like`
  - Like a post
  - Body: `{ wallet_address }`
- `POST /posts/:id/comment`
  - Comment on a post
  - Body: `{ wallet_address, content }`

## ✨ Features Overview

### Completed Features
- [x] Wallet Authentication
  - Ethereum wallet signature verification
  - Message signing validation
  - User registration status check
  - Secure session management

- [x] User Management
  - Profile creation and updates
  - Unique wallet-based identification
  - Profile data persistence in PostgreSQL
  - Data validation and sanitization

- [x] Database Integration
  - PostgreSQL database setup
  - TypeORM integration
  - User data persistence
  - Database migrations support

- [x] API Infrastructure
  - RESTful API endpoints
  - Request validation using class-validator
  - Global error handling
  - CORS configuration
  - Swagger documentation
  - TypeScript interfaces and DTOs

### In Progress
- [ ] Post Management
  - Post creation and retrieval
  - Feed implementation with pagination
  - Like and comment functionality
  - Post data persistence

## 🔒 Security Features
- Wallet signature verification using ethers.js
- CORS protection with configurable origins
- Input validation and sanitization
- Environment variable management
- TypeORM entity validation
- Global exception handling

## 🧪 Testing
- Unit tests for services
- Integration tests for controllers
- E2E tests for API endpoints
- Database testing utilities

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
