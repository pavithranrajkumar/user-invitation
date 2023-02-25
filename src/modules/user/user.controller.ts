import { Controller, Post, Request } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  async create(@Request() req) {
    const user = await this.userService.create(req.body);
    return user;
  }

  @Post('login')
  async login(@Request() req) {
    const { email, password } = req.body;
    return this.userService.login(email, password);
  }
}
