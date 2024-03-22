import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserOauthProvider } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { log } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserOauthProvider.name)
    private userOathProviderModel: Model<UserOauthProvider>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async createProvider(provider: any): Promise<UserOauthProvider> {
    const newProvider = await new this.userOathProviderModel(provider).save();
    return newProvider;
  }

  async createWithProvider(
    createUserDto: CreateUserDto,
    provider: any,
  ): Promise<User> {
    const newProvider = await this.createProvider(provider);

    const createdUser = new this.userModel({
      ...createUserDto,
      providers: [newProvider._id],
    });
    return (await createdUser.save()).toObject() as User;
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async findOne(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).lean();
  }

  async findByProviderId(providerId: string): Promise<User> {
    const profile: UserOauthProvider = await this.userOathProviderModel
      .findOne({ profileId: providerId })
      .lean();

    if (profile == null) {
      return null;
    }

    return await this.userModel.findOne({ providers: profile._id }).lean();
  }

  async addProviderToUser(id: string, provider: UserOauthProvider) {
    const user = await this.userModel.findById(id);
    user.providers.push(provider);
    return (await user.save()).toObject() as User;
  }
}
