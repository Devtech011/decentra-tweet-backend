import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ethers } from 'ethers';
import { UsersService } from '../users/users.service';
import { VerifySignatureDto } from './dto/verify-signature.dto';
import { VerifySignatureResponseDto } from './dto/verify-signature-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async verifySignature(data: VerifySignatureDto): Promise<VerifySignatureResponseDto> {
    const messageHash = ethers.hashMessage(data.message);
    const recoveredAddress = ethers.verifyMessage(data.message, data.signature);

    if (recoveredAddress.toLowerCase() !== data.wallet_address.toLowerCase()) {
      throw new UnauthorizedException('Invalid signature');
    }

    const userProfile = await this.usersService.findByWalletAddress(data.wallet_address);

    return {
      valid: true,
      wallet_address: data.wallet_address,
      message: data.message,
      recovered_address: recoveredAddress,
      is_registered: !!userProfile,
    };
  }
}
