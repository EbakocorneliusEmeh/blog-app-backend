import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  
  constructor(private readonly authService: AuthService) {
    const clientID = process.env.AUTH_GOOGLE_ID;
    const clientSecret = process.env.AUTH_GOOGLE_SECRET;

    if (!clientID || !clientSecret) {
      throw new Error(
        'Google OAuth requires AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET environment variables.',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL: process.env.AUTH_GOOGLE_CALLBACK_URL || 'http://localhost:4000/auth/google/callback',
      scope: ['email', 'profile'],
    } as any);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    console.log('--- Google Strategy: Validating user ---');
    console.log('Received profile:', JSON.stringify(profile, null, 2));
    try {
      const { name, emails, photos, _json } = profile;


      if (!_json?.email_verified) {
        throw new UnauthorizedException('Google email is not verified');
      }

      if (!emails || emails.length === 0) {
        throw new UnauthorizedException('No email found from Google');
      }

      const user = await this.authService.validateGoogleUser({
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName || '',
        picture: photos?.[0]?.value || null,
      });

      console.log('User validated successfully:', user);
      return user;
      
    } catch (error) {
      console.error('!!! Google Strategy: Validation Error !!!', error);
      throw error;
    }
  }
}