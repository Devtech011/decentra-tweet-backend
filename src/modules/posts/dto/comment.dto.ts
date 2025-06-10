import { IsString, IsEthereumAddress, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'Ethereum wallet address of the commenter' })
  @IsEthereumAddress()
  wallet_address: string;

  @ApiProperty({ description: 'Content of the comment', minLength: 1, maxLength: 500 })
  @IsString()
  @Length(1, 500, { message: 'Comment content must be between 1 and 500 characters' })
  content: string;
}

export class CommentResponseDto {
  @ApiProperty({ description: 'Comment ID' })
  id: number;

  @ApiProperty({ description: 'Post ID' })
  post_id: number;

  @ApiProperty({ description: 'Commenter wallet address' })
  wallet_address: string;

  @ApiProperty({ description: 'Comment content' })
  content: string;

  @ApiProperty({ description: 'Comment creation timestamp' })
  timestamp: Date;

  @ApiProperty({ description: 'Commenter username', required: false })
  username?: string;

  @ApiProperty({ description: 'Commenter profile picture URL', required: false })
  profile_pic_url?: string;
} 