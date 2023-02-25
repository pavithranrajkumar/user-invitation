import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { CreateUserDto } from './user.dto';
import { User, UserDocument } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(`User with email "${email}" already exists`);
    }
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    const match = await compare(password, user.password);
    console.log({ password, up: user.password });
    if (!match) {
      throw new BadRequestException('Please provide correct credentials!');
    }
    return user;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.validateUser(email, password);

    const payload: JwtPayload = { _id: user._id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return { user, accessToken };
  }
}
