import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Profile, Strategy } from 'passport-facebook';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get('FACEBOOK_CALL_BACK_URL'),
      scope: ['email'],
      session: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const logger = new Logger();
    logger.debug(profile, 'facebookStrategy: refreshToken');
    logger.debug(accessToken, 'facebookStrategy: accessToken');
    logger.debug(refreshToken, 'facebookStrategy: refreshToken');

    const userProviderDto: UserProfileDto = {
      profileId: profile.id,
      provider: profile.provider,
      username: profile.displayName,
      email: profile.emails[0].value,
      accessToken,
      refreshToken,
      avatar: profile.photos[0].value,
    };

    const user = await this.authService.validateUserByProvider(userProviderDto);

    return user || null;
  }
}
