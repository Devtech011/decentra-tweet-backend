import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':wallet')
  async getUser(@Param('wallet') wallet: string) {
    return this.usersService.getUserProfile(wallet);
  }

  @Post()
  async upsertUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createOrUpdate(createUserDto);
  }
}
