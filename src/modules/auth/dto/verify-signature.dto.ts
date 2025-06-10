import { IsString, IsEthereumAddress, Length } from 'class-validator';

export class VerifySignatureDto {
  @IsEthereumAddress()
  wallet_address: string;

  @IsString()
  @Length(132, 132, { message: 'Signature must be 132 characters long (0x + 130 hex chars)' })
  signature: string;

  @IsString()
  @Length(1, 1000, { message: 'Message must be between 1 and 1000 characters' })
  message: string;
} 