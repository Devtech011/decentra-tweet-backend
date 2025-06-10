import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':wallet')
  async getUser(@Param('wallet') wallet: string) {
    return this.usersService.getUserProfile(wallet);
  }

  @Post()
  async upsertUser(@Body() body: { wallet_address: string; username?: string; bio?: string; profile_pic_url?: string }) {
    return this.usersService.upsertUserProfile(body);
  }
}
