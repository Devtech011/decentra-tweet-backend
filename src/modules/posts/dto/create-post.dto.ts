import { IsString, IsEthereumAddress, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'Ethereum wallet address of the post creator' })
  @IsEthereumAddress()
  wallet_address: string;

  @ApiProperty({ description: 'Content of the post', minLength: 1, maxLength: 1000 })
  @IsString()
  @Length(1, 1000, { message: 'Post content must be between 1 and 1000 characters' })
  content: string;
} 