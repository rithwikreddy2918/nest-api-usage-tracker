import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(email: string, password: string) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email },
        });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashed,
    });

    return await this.userRepository.save(user);
  } catch (error) {
    
    if (error.code === '23505') {
      throw new ConflictException('Email already registered');
    }

    throw error;
  }
}

  

  findAll() {
    return this.userRepository.find({
      select: ['id', 'email'],
    });
  }
    async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  // UPDATE USER
    async update(id: number, email: string) {
    const user = await this.userRepository.findOne({
      where: { id },
       });

    if (!user) {
      throw new NotFoundException('User not found');
      }

    user.email = email;
    await this.userRepository.save(user);

     return { message: 'User updated successfully' };
  }
    // DELETE USER
async remove(id: number) {
  const result = await this.userRepository.delete(id);

  if (result.affected === 0) {
    throw new NotFoundException('User not found');
  }

  return { message: 'User deleted successfully' };
}

}
