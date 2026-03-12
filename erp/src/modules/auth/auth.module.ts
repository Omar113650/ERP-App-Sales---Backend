import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entities';
import { EmailModule } from '../email/email.module';
import{GoogleStrategy} from './Strategy/google.strategy'
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    
    JwtModule.registerAsync({
      imports: [ConfigModule, EmailModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret =
          configService.get<string>('jwt.secret') || 'defaultSecretKey';
        const expiresIn = configService.get<string>('jwt.expiresIn') || '86400';

        return {
          secret,
          signOptions: { expiresIn: parseInt(expiresIn, 10) },
        };
      },
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,GoogleStrategy],
  exports: [AuthService, JwtModule], 

})
export class AuthModule {}