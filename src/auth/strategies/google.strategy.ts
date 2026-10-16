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
    try {
      const email = profile?.emails?.[0]?.value || profile?._json?.email;
      const isEmailVerified =
        profile?._json?.email_verified === true || profile?.emails?.[0]?.verified === true;

      if (!email) {
        throw new UnauthorizedException('No email found from Google');
      }

      if (!isEmailVerified) {
        throw new UnauthorizedException('Google email is not verified');
      }

  return this.authService.validateGoogleUser({
        email,
        firstName: profile?.name?.givenName,
        lastName: profile?.name?.familyName,
        picture: profile.photos?.[0]?.value,
      });
    } catch (error) {
      throw error;
    }
  }
}