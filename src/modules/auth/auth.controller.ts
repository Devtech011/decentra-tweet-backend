import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { VerifySignatureDto } from './dto/verify-signature.dto';
import { VerifySignatureResponseDto } from './dto/verify-signature-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify wallet signature and create/update user' })
  @ApiResponse({ status: 200, description: 'Signature verified successfully', type: VerifySignatureResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid signature or request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async verify(@Body() verifySignatureDto: VerifySignatureDto): Promise<VerifySignatureResponseDto> {
    return this.authService.verifySignature(verifySignatureDto);
  }

  @Post('verify-signature')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify wallet signature and create/update user (legacy endpoint)' })
  @ApiResponse({ status: 200, description: 'Signature verified successfully', type: VerifySignatureResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid signature or request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async verifySignature(@Body() verifySignatureDto: VerifySignatureDto): Promise<VerifySignatureResponseDto> {
    return this.authService.verifySignature(verifySignatureDto);
  }
}
