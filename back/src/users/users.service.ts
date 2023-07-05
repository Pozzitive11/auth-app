import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/users.model";
import { userDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User
  ) {}

  async createUser(dto: userDto.Basic): Promise<User> {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.findAll({
      include: { all: true },
    });
    return users;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async getUserById(
    id: number
  ): Promise<{ email: string; id: number }> {
    const user = await this.userRepository.findOne({
      where: { id },
      attributes: ["email", "id"],
    });
    return user;
  }
}
