import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleGuard } from './google.guard';
import { FacebookGuard } from './facebook.guard';
import { GithubGuard } from './github.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/login')
  @Render('login')
  async loginPage() {
    return {};
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/signup')
  @Render('signup')
  async signupPage() {
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Get('/profile-ui')
  @Render('profile')
  async getProfileUI() {
    return null;
  }

  @UseGuards(GoogleGuard)
  @Get('/google/login')
  async googleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(GoogleGuard)
  @Get('/google/signup')
  async googleSignup(@Request() req) {
    return null;
  }

  @UseGuards(GoogleGuard)
  @Get('/google/redirect')
  @Render('registerJwt')
  async handlerGoogleRedirect(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(FacebookGuard)
  @Get('/facebook/login')
  async facebookLogin(@Request() req) {
    return null;
  }

  @UseGuards(FacebookGuard)
  @Get('/facebook/signup')
  async facebookSignup(@Request() req) {
    return null;
  }

  @UseGuards(FacebookGuard)
  @Get('/facebook/redirect')
  @Render('registerJwt')
  async handlerFacebookRedirect(@Request() req) {
    return this.authService.login(req.user);
  }

  // Github
  @UseGuards(GithubGuard)
  @Get('/github/login')
  async githubLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(GithubGuard)
  @Get('/github/signup')
  async githubSignup(@Request() req) {
    return null;
  }

  @UseGuards(GithubGuard)
  @Get('/github/redirect')
  @Render('registerJwt')
  async handlerGithubRedirect(@Request() req) {
    return this.authService.login(req.user);
  }
}
