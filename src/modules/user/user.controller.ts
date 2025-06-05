import {
  Get,
  Param,
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get('/username/:username')
  getUser(@Param('username') username: string) {
    return this.userService.getUser(username);
  }

  @Get('/id/:id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Patch('/users/:username')
  updateUser(@Body() body: CreateUserDto) {
    return this.userService.updateUser(body);
  }

  @Delete('/users/:username')
  deleteUser(@Param('username') username: string) {
    return this.userService.deleteUser(username);
  }
}
