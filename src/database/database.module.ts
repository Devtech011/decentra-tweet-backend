import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Post } from '../modules/posts/entities/post.entity';
import { Comment } from '../modules/posts/entities/comment.entity';
import { Like } from '../modules/posts/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'decentra_tweet',
      entities: [User, Post, Comment, Like],
      synchronize: false, // Disabled to prevent conflicts with Prisma
    }),
    TypeOrmModule.forFeature([User, Post, Comment, Like]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
