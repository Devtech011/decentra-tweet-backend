import { ApiProperty } from '@nestjs/swagger';

export class VerifySignatureResponseDto {
  @ApiProperty({ description: 'Whether the signature is valid' })
  valid: boolean;

  @ApiProperty({ description: 'The wallet address that was verified' })
  wallet_address: string;

  @ApiProperty({ description: 'The message that was signed' })
  message: string;

  @ApiProperty({ description: 'The recovered address from the signature' })
  recovered_address: string;

  @ApiProperty({ description: 'Whether the user exists in the database' })
  is_registered: boolean;
} 