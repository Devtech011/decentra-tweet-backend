import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getFeed() {
    return this.postsService.getFeed();
  }

  @Post()
  async createPost(@Body() body: { wallet_address: string; content: string }) {
    return this.postsService.createPost(body);
  }

  @Post(':id/like')
  async likePost(@Param('id') id: string, @Body() body: { wallet_address: string }) {
    return this.postsService.likePost(Number(id), body.wallet_address);
  }

  @Post(':id/comment')
  async commentOnPost(@Param('id') id: string, @Body() body: { wallet_address: string; content: string }) {
    return this.postsService.commentOnPost(Number(id), body.wallet_address, body.content);
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return this.postsService.getPostDetails(Number(id));
  }
}
