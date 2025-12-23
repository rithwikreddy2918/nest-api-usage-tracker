import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
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
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({
      select: ['id', 'email'],
    });
  }
}
