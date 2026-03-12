import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entities';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { VerifyOtpDto } from './dto/verifyotp.dto';
import { ResendOtpDto } from './dto/resendotp.dto';
import { plainToInstance } from 'class-transformer';
import { generateTokens } from '../../shared/utils/Token';
import { setAuthCookies } from '../../shared/utils/setAuthCookies';
import { LoginDto } from './dto/login-user.dto';
import { Response } from 'express';
import { EmailService } from '../email/email.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async Register(createUserDto: CreateUserDto, res: Response<any>) {
    const ExistingEmail = await this.UserRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (ExistingEmail)
      throw new BadRequestException('this email is already exist');

    const HashPassword = await bcrypt.hash(createUserDto.password, 10);

    const otp = randomInt(100000, 1000000).toString();
    const HashOtp = await bcrypt.hash(otp, 5);
    const otp_expires_at = new Date(Date.now() + 2 * 60 * 1000);

    const NewUser = this.UserRepository.create({
      ...createUserDto,
      password: HashPassword,
      otp: HashOtp,
      otp_expires_at,
    });
    await this.UserRepository.save(NewUser);

    setTimeout(
      async () => {
        const user = await this.UserRepository.findOne({
          where: { id: NewUser.id },
        });
        if (user && user.otp && new Date() >= user.otp_expires_at!) {
          ((user.otp = null),
            (user.otp_expires_at = null),
            await this.UserRepository.save(user));
        }
      },
      3 * 60 * 1000,
    );

    await this.emailService.sendOtpEmail({
      to: createUserDto.email,
      otp,
      subject: 'Your OTP Code',
    });

    const tokens = await generateTokens(this.jwtService, NewUser);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return { message: 'Otp resend to email', tokens, NewUser };
  }

  async verifyOtp({ email, otp }: VerifyOtpDto) {
    const user = await this.UserRepository.findOne({
      where: { email },
      select: ['id', 'otp', 'otp_expires_at', 'is_account_verified'],
    });

    if (!user || user.is_account_verified) {
      throw new BadRequestException(
        !user ? 'User not found' : 'Email is already verified',
      );
    }

    if (!user.otp || !user.otp_expires_at) {
      throw new BadRequestException('No OTP found, please request a new one');
    }

    const isExpired = user.otp_expires_at.getTime() < Date.now();
    const isInvalidOtp = !(await bcrypt.compare(otp, user.otp));

    if (isExpired || isInvalidOtp) {
      throw new BadRequestException(
        isExpired ? 'OTP has expired, please resend' : 'Invalid OTP',
      );
    }

    await this.emailService.sendOtpSuccessEmail({
      to: email,
      subject: 'Account Successfully Verified',
    });

    user.is_account_verified = true;
    user.otp = null;
    user.otp_expires_at = null;

    await this.UserRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async resendOtp({ email }: ResendOtpDto) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.UserRepository.findOne({
      where: { email },
      select: ['id', 'otp', 'otp_expires_at', 'is_account_verified'],
    });

    if (!user || user.is_account_verified) {
      return { message: 'Account already verified or user not found' };
    }

    const canResend =
      !user.otp_expires_at ||
      user.otp_expires_at.getTime() <= Date.now() - 60 * 1000;

    if (!canResend) {
      throw new BadRequestException('Please wait before requesting a new OTP');
    }

    const otp = randomInt(100000, 999999).toString();
    user.otp = await bcrypt.hash(otp, 5);
    user.otp_expires_at = new Date(Date.now() + 10 * 60 * 1000);

    await this.emailService.sendOtpEmail({
      to: email,
      otp,
      subject: 'Your New OTP Code',
    });
    await this.UserRepository.save(user);

    return { message: 'New OTP has been sent to your email' };
  }

  async login(loginDto: LoginDto, res: Response<any>) {
    const user = await this.UserRepository.findOne({
      where: { email: loginDto.email },
      select: [
        'id',
        'name',
        'email',
        'password',
        'is_account_verified',
        'role',
      ],
    });

    if (!user) throw new BadRequestException('Invalid email or password');
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid email or password');

    // if (!user.is_account_verified)
    //   throw new BadRequestException('Please verify your email first');

    const tokens = await generateTokens(this.jwtService, user);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    // await this.emailService.sendWelcomeAfterLogin({
    //   to: loginDto.email,
    //   subject: 'Welcome Back!',
    // });
    const safeUser = plainToInstance(User, user, {
      excludeExtraneousValues: false,
    });

    return { user: safeUser, tokens };
  }

  async logout(res: Response) {
    const isProd = process.env.NODE_ENV === 'production';

    // مسح Access + Refresh Cookies
    res.clearCookie('AccessToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    });

    res.clearCookie('RefreshToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    });

    return { message: 'Logged out successfully' };
  }
  async forgetPassword({ email }: { email: string }) {
    const existingUser = await this.UserRepository.findOne({
      where: { email },
    });
    if (!existingUser) throw new BadRequestException('Email not found');

    const otp = randomInt(100000, 1000000).toString(); // 6 أرقام
    const hashedOtp = await bcrypt.hash(otp, 5);

    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

    existingUser.otp = hashedOtp;
    existingUser.otp_expires_at = otpExpiresAt;
    await this.UserRepository.save(existingUser);

    await this.emailService.sendOtpEmail({
      to: email,
      otp,
      subject: 'Reset Your Password - OTP',
    });

    return {
      message: 'OTP sent to your email',
      otpExpiresAt, // optional: useful for frontend timer
    };
  }

  async resetPassword(userId: string, newPassword: string) {
    if (!userId || !newPassword) {
      throw new BadRequestException('userId and password are required');
    }

    const user = await this.UserRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.UserRepository.save(user);

    return {
      message:
        'Password changed successfully. Now you can login with this password',
    };
  }

  async refreshToken(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    let decoded: any;
    try {
      decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.UserRepository.findOne({
      where: { id: decoded.sub },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // توليد access token جديد (يمكن تجديد refresh token لو تحب)
    const { accessToken } = await generateTokens(this.jwtService, user);

    // وضع الـ access token في cookie
    setAuthCookies(res, accessToken, refreshToken); // نعيد refreshToken القديم في الكوكيز

    return {
      message: 'Access token refreshed successfully',
      accessToken,
      user,
    };
  }
}
