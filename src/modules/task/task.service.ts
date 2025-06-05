import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Assuming you have a User entity
  ) {}
  async getAllTasks() {
    const tasks = await this.taskRepository.find();
    console.log('Fetching all tasks: ', tasks);
    return tasks;
  }
  async createTask(taskDto: CreateTaskDto, userId: number): Promise<Task> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newTask = this.taskRepository.create({
      name: taskDto.name,
      description: taskDto.description ?? '',
      createdAt: new Date(),
      completedAt: null,
      user,
      // user: user as any,
    });
    console.log('Task to save: ', newTask);
    const saved = await this.taskRepository.save(newTask);
    console.log('Task saved: ', saved);
    return saved;
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    console.log('Task found: ', task);
    return task;
  }

  async updateTask(id: number, completed: boolean) {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new Error('Task not found');
    }
    task.completedAt = completed ? new Date() : null;
    return await this.taskRepository.save(task);
  }
  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  // task.service.ts
  async deleteAllTasks() {
    try {
      await this.taskRepository
        .createQueryBuilder()
        .delete()
        .from(Task) // Use the table name or Task entity
        .execute();

      return { message: 'All tasks deleted successfully.' };
    } catch (error) {
      console.error('❌ Error in deleteAllTasks:', error);
      throw new Error('Failed to delete all tasks.');
    }
  }
}
