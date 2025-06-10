import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUserProfile(walletAddress: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { wallet_address: walletAddress.toLowerCase() }
    });
    return user || null;
  }

  async upsertUserProfile(data: {
    wallet_address: string;
    username?: string;
    bio?: string;
    profile_pic_url?: string;
  }): Promise<User> {
    const user = await this.getUserProfile(data.wallet_address);
    
    if (user) {
      // Update existing user
      Object.assign(user, {
        username: data.username ?? user.username,
        bio: data.bio ?? user.bio,
        profile_pic_url: data.profile_pic_url ?? user.profile_pic_url,
      });
      return this.usersRepository.save(user);
    } else {
      // Create new user
      const newUser = this.usersRepository.create({
        wallet_address: data.wallet_address.toLowerCase(),
        username: data.username,
        bio: data.bio,
        profile_pic_url: data.profile_pic_url,
      });
      return this.usersRepository.save(newUser);
    }
  }
}
