import { Inject, Injectable, Logger } from '@nestjs/common';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALL_BACK_URL'),
      scope: ['email', 'profile'],
      session: false,
    });
    const logger = new Logger();
    logger.debug(
      configService.get('FACEBOOK_CLIENT_ID'),
      'facebookStrategy: profile',
    );
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
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
    const logger = new Logger();
    logger.debug(accessToken, 'authService: accessToken');
    logger.debug(refreshToken, 'authService: refreshToken');
    return user || null;
  }
}
