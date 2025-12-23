import { Controller, Get, Post, Body, UseGuards,Param,ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Put } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Delete } from '@nestjs/common';


@Controller('users')
@UseGuards(JwtAuthGuard) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // POST /users
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto.email, dto.password);
  }
  // GET /users/:id
   @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
  //  PUT /users/:id (UPDATE)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto.email);
  }
   // ✅ DELETE /users/:id
   @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
 }
}
