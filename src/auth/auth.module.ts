import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/user.schema';
import { Tenant, TenantSchema } from '../tenants/tenant.schema';
import { TenantModule } from '../tenants/tenant.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
// import { EmailModule } from '../email/email.module'; 
import { GoogleStrategy } from './strategies/google.strategy'; 
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    // EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'defaultSecret',
        signOptions: { expiresIn: '7d' },
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tenant.name, schema: TenantSchema },
    ]),
    TenantModule,
    UsersModule,
  ],
  controllers: [AuthController],
  // allow disabling Google auth during development/testing by setting DISABLE_GOOGLE_AUTH=true
  providers: [
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
    ...(process.env.DISABLE_GOOGLE_AUTH === 'true' ? [] : [GoogleStrategy]),
  ],
  exports: [JwtModule, AuthService, JwtAuthGuard],
})
export class AuthModule {}