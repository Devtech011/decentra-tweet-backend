import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MESSAGES } from '../../common/constants/messages.constant';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { wallet_address: walletAddress.toLowerCase() },
    });
  }

  async createOrUpdate(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByWalletAddress(createUserDto.wallet_address);

    if (existingUser) {
      const updateData: UpdateUserDto = {
        username: createUserDto.username || existingUser.username,
        bio: createUserDto.bio || existingUser.bio,
        profile_pic_url: createUserDto.profile_pic_url || existingUser.profile_pic_url,
      };

      Object.assign(existingUser, updateData);
      return this.usersRepository.save(existingUser);
    }

    const newUser = this.usersRepository.create({
      wallet_address: createUserDto.wallet_address.toLowerCase(),
      username: createUserDto.username,
      bio: createUserDto.bio,
      profile_pic_url: createUserDto.profile_pic_url,
    });

    return this.usersRepository.save(newUser);
  }

  async getUserProfile(walletAddress: string): Promise<User> {
    const user = await this.findByWalletAddress(walletAddress);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER.ERROR.NOT_FOUND);
    }
    return user;
  }
}
