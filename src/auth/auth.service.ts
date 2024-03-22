import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile as FacebookProfile } from 'passport-facebook';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User, UserOauthProvider } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { UserProfileDto } from './dto/user-profile.dto';
import * as randomString from 'randomstring';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getUserWithoutPassword(user: User) {
    const { password, ...result } = user;
    return result;
  }

  async validateUserByProvider(userProfileDto: UserProfileDto): Promise<any> {
    let user = await this.userService.findOne(userProfileDto.email);
    // Check if have any user with this email
    if (user) {
      const provider = {
        profileId: userProfileDto.profileId,
        provider: userProfileDto.provider,
        // accessToken: userProfileDto.accessToken,
        refreshToken: userProfileDto.refreshToken,
      };

      const userProvider = await this.userService.findByProviderId(
        userProfileDto.profileId,
      );

      // If exsit user with this profileId
      if (userProvider) {
        return this.getUserWithoutPassword(userProvider);
      }

      // If this user don't have this profileId
      // Add provider to user
      const newProvider = await this.userService.createProvider(provider);
      user = await this.userService.addProviderToUser(
        user._id.toString(),
        newProvider,
      );
      return this.getUserWithoutPassword(user);
    }

    // If not have any user with this email
    const createUserDto: CreateUserDto = {
      username: userProfileDto.username,
      password: randomString.generate(10),
      email: userProfileDto.email,
      avatar: userProfileDto.avatar,
    };
    const provider = {
      profileId: userProfileDto.profileId,
      provider: userProfileDto.provider,
      // accessToken: userProfileDto.accessToken,
      refreshToken: userProfileDto.refreshToken,
    };
    const newUser: User = await this.userService.createWithProvider(
      createUserDto,
      provider,
    );
    return this.getUserWithoutPassword(newUser);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user && user.password === password) {
      return this.getUserWithoutPassword(user);
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
