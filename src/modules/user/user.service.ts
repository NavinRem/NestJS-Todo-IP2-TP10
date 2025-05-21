import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  create(userData: Partial<User>) {
    const user = this.usersRepo.create(userData);
    return this.usersRepo.save(user);
  }

  findAll() {
    return this.usersRepo.find({ relations: ['tasks'] });
  }

  findOne(id: number) {
    return this.usersRepo.findOne({ where: { id }, relations: ['tasks'] });
  }

  remove(id: number) {
    return this.usersRepo.delete(id);
  }

  async update(id: number, updateData: Partial<User>) {
    await this.usersRepo.update(id, updateData);
    return this.findOne(id);
  }

  async getUser(username: string) {
    return this.usersRepo.findOne({ where: { username } });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async updateUser(data: CreateUserDto): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { username: data.username },
    });
    if (!user) throw new Error('User not found');
    user.email = data.email;
    user.password = data.password;
    return this.usersRepo.save(user);
  }

  async deleteUser(username: string) {
    return this.usersRepo.delete({ username });
  }
}
