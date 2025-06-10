import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ethers } from 'ethers';
import { VerifySignatureDto } from './dto/verify-signature.dto';
import { VerifySignatureResponseDto } from './dto/verify-signature-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async verifySignature(data: VerifySignatureDto): Promise<VerifySignatureResponseDto> {
    try {
      console.log('data=========>',data);
      // Create a message hash
      const messageHash = ethers.hashMessage(data.message);
      console.log('dxdsdsdsdsds=-=========>',messageHash);
      
      // Recover the address from the signature
      const recoveredAddress = ethers.verifyMessage(data.message, data.signature);
      
      // Check if the recovered address matches the provided wallet address
      const isValid = recoveredAddress.toLowerCase() === data.wallet_address.toLowerCase();
      
      if (!isValid) {
        throw new UnauthorizedException('Invalid signature');
      }

      // Check if user exists in database
      const userProfile = await this.usersService.getUserProfile(data.wallet_address);
      console.log('userProfile=========>',userProfile);
      const isRegistered = !!userProfile;

      return {
        valid: true,
        wallet_address: data.wallet_address,
        message: data.message,
        recovered_address: recoveredAddress,
        is_registered: isRegistered
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to verify signature: ' + error.message);
    }
  }
}
