import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get('GITHUB_CALL_BACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ): Promise<any> {
    const logger = new Logger();
    logger.debug(profile, 'githubStrategy: refreshToken');
    logger.debug(accessToken, 'githubStrategy: accessToken');
    logger.debug(refreshToken, 'githubStrategy: refreshToken');

    const userProviderDto: UserProfileDto = {
      profileId: profile.id,
      provider: profile.provider,
      username: profile.username,
      email: profile.emails[0].value,
      accessToken,
      refreshToken,
      avatar: profile.photos[0].value,
    };

    // Add your validation logic here
    // This method will be called after a successful authentication
    // You can access the user's profile data using the `profile` parameter
    // You can also store the user's data in your database or perform any other necessary operations
    const user = await this.authService.validateUserByProvider(userProviderDto);
    logger.debug(user, 'githubStrategy: user');

    // Example of returning the user's profile
    return user || null;
  }
}
