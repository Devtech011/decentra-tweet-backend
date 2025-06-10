import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({ name: 'wallet_address' })
  wallet_address: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ name: 'profile_pic_url', nullable: true })
  profile_pic_url: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
} 