import { Controller, Get, Post, Delete, Param, Body, Query, HttpCode, HttpStatus, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto, CommentResponseDto } from './dto/comment.dto';
import { PostResponseDto, FeedResponseDto } from './dto/post-response.dto';
import { MESSAGES } from '../../common/constants/messages.constant';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get feed of posts' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Posts per page (default: 10)' })
  @ApiQuery({ name: 'wallet_address', required: false, type: String, description: 'Current user wallet address for likes info' })
  @ApiResponse({ status: 200, description: 'Returns feed of posts', type: FeedResponseDto })
  async getFeed(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('wallet_address') walletAddress?: string,
  ): Promise<FeedResponseDto> {
    if (page && page < 1) {
      throw new BadRequestException('Page number must be greater than 0');
    }
    if (limit && (limit < 1 || limit > 50)) {
      throw new BadRequestException('Limit must be between 1 and 50');
    }
    return this.postsService.getFeed(page, limit, walletAddress);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully', type: PostResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createPost(@Body() createPostDto: CreatePostDto): Promise<PostResponseDto> {
    return this.postsService.createPost(createPostDto);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post liked successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Post already liked or invalid post ID' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async likePost(
    @Param('id', ParseIntPipe) id: number,
    @Body('wallet_address') walletAddress: string,
  ): Promise<void> {
    if (!walletAddress) {
      throw new BadRequestException('Wallet address is required');
    }
    await this.postsService.likePost(id, walletAddress);
  }

  @Delete(':id/like')
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post unliked successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Post not liked or invalid post ID' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async unlikePost(
    @Param('id', ParseIntPipe) id: number,
    @Body('wallet_address') walletAddress: string,
  ): Promise<void> {
    if (!walletAddress) {
      throw new BadRequestException('Wallet address is required');
    }
    await this.postsService.unlikePost(id, walletAddress);
  }

  @Get(':id/likes')
  @ApiOperation({ summary: 'Get post likes' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Returns list of users who liked the post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostLikes(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ wallet_address: string; username?: string; profile_pic_url?: string }[]> {
    return this.postsService.getPostLikes(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post details' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiQuery({ name: 'wallet_address', required: false, type: String, description: 'Current user wallet address for likes info' })
  @ApiResponse({ status: 200, description: 'Returns post details', type: PostResponseDto })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostDetails(
    @Param('id', ParseIntPipe) id: number,
    @Query('wallet_address') walletAddress?: string,
  ): Promise<PostResponseDto> {
    return this.postsService.getPostDetails(id, walletAddress);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Unauthorized or invalid post ID' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Body('wallet_address') walletAddress: string,
  ): Promise<void> {
    if (!walletAddress) {
      throw new BadRequestException('Wallet address is required');
    }
    await this.postsService.deletePost(id, walletAddress);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 201, description: 'Comment added successfully', type: CommentResponseDto })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.postsService.addComment(id, createCommentDto);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Comments per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Returns comments for the post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getComments(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    if (page && page < 1) {
      throw new BadRequestException('Page number must be greater than 0');
    }
    if (limit && (limit < 1 || limit > 50)) {
      throw new BadRequestException('Limit must be between 1 and 50');
    }
    return this.postsService.getComments(id, page, limit);
  }

  @Delete('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 204, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized to delete this comment' })
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Body('wallet_address') walletAddress: string,
  ): Promise<void> {
    if (!walletAddress) {
      throw new BadRequestException(MESSAGES.VALIDATION.ERROR.REQUIRED_FIELD);
    }
    await this.postsService.deleteComment(id, walletAddress);
  }
}
