import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, PostsModule],
})
export class AppModule {}
