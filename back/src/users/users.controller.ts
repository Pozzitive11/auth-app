import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { userDto } from "./dto/create-user.dto";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() userDto: userDto.Basic) {
    return this.usersService.createUser(userDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.usersService.getAllUsers();
  }

  @Get("id/:id")
  @UseGuards(JwtAuthGuard)
  getUserById(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }
}
