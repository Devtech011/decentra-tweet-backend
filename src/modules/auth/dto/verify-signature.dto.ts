import { IsString, IsEthereumAddress, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifySignatureDto {
  @ApiProperty({ description: 'Ethereum wallet address' })
  @IsEthereumAddress()
  wallet_address: string;

  @ApiProperty({ description: 'Message that was signed' })
  @IsString()
  @Length(1, 1000, { message: 'Message must be between 1 and 1000 characters' })
  message: string;

  @ApiProperty({ description: 'Signature of the message' })
  @IsString()
  @Length(132, 132, { message: 'Signature must be 132 characters long (0x + 130 hex chars)' })
  signature: string;

  @ApiProperty({ description: 'Username', required: false })
  @IsOptional()
  @IsString()
  @Length(3, 30, { message: 'Username must be between 3 and 30 characters' })
  username?: string;

  @ApiProperty({ description: 'User bio', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Bio must not exceed 500 characters' })
  bio?: string;

  @ApiProperty({ description: 'Profile picture URL', required: false })
  @IsOptional()
  @IsString()
  profile_pic_url?: string;
} 