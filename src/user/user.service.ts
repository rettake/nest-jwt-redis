import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(email: string, hash: string, salt: string): Promise<User> {
    const createdUser = this.userRepository.create({ email, hash, salt });
    await this.userRepository.save(createdUser);

    return createdUser;
  }
}
