import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
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

  @Get('/:id')
  getTaskById(@Param('id') id: number): Promise<Task> {
    return this.taskService.findOne(+id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createTask(@Body() taskDto: CreateTaskDto): Promise<Task> {
    // You need to provide the userId here. Replace 1 with the actual userId as needed.
    const userId = taskDto.userId; // assuming userId is sent in the body
    return this.taskService.createTask(taskDto, userId);
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
