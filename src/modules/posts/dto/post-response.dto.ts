import { ApiProperty } from '@nestjs/swagger';
import { CommentResponseDto } from './comment.dto';

export class LikeInfoDto {
  @ApiProperty({ description: 'Wallet address of the user who liked' })
  wallet_address: string;

  @ApiProperty({ description: 'Username of the user who liked', required: false })
  username?: string;

  @ApiProperty({ description: 'Profile picture URL of the user who liked', required: false })
  profile_pic_url?: string;
}

export class PostResponseDto {
  @ApiProperty({ description: 'Post ID' })
  id: number;

  @ApiProperty({ description: 'Wallet address of the post author' })
  wallet_address: string;

  @ApiProperty({ description: 'Post content' })
  content: string;

  @ApiProperty({ description: 'Post creation timestamp' })
  timestamp: Date;

  @ApiProperty({ description: 'Username of the post author', required: false })
  username?: string;

  @ApiProperty({ description: 'Profile picture URL of the post author', required: false })
  profile_pic_url?: string;

  @ApiProperty({ description: 'Number of likes on the post' })
  likes_count: number;

  @ApiProperty({ description: 'List of users who liked the post', type: [LikeInfoDto] })
  likes: LikeInfoDto[];

  @ApiProperty({ description: 'Number of comments on the post' })
  comments_count: number;

  @ApiProperty({ description: 'List of comments on the post', type: [CommentResponseDto] })
  comments: CommentResponseDto[];

  @ApiProperty({ description: 'Whether the current user has liked the post', required: false })
  is_liked?: boolean;
}

export class FeedResponseDto {
  @ApiProperty({ description: 'List of posts', type: [PostResponseDto] })
  posts: PostResponseDto[];

  @ApiProperty({ description: 'Total number of posts' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of posts per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  total_pages: number;
} 