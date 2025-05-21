import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Post()
  createTask(@Body() taskDto: CreateTaskDto): Promise<Task> {
    const username = taskDto.username; // assuming username is sent in body
    return this.taskService.createTask(taskDto, username);
  }

  @Patch('/:id/done')
  markTaskAsDone(@Param('id') id: number) {
    return this.taskService.updateTask(+id, true);
  }

  @Patch('/:id/pending')
  markTaskAsPending(@Param('id') id: number) {
    return this.taskService.updateTask(+id, false);
  }

  @Delete('deleteAll')
  deleteAllTasks() {
    return this.taskService.deleteAllTasks();
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: number) {
    return this.taskService.deleteTask(id);
  }
}
