import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { VerifyOtpDto } from './dto/verifyotp.dto';
import { ResendOtpDto } from './dto/resendotp.dto';
import type { Response, Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';

@ApiTags('authentication')
@Controller({ version: '1', path: 'auth' })
@Controller('api/auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user with OTP verification' })
  async register(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authservice.Register(body, res);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify email using OTP' })
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return await this.authservice.verifyOtp(body);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to email' })
  async resendOtp(@Body() body: ResendOtpDto) {
    return await this.authservice.resendOtp(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and set authentication cookies' })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authservice.login(body, res);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user and clear cookies' })
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.authservice.logout(res);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.RefreshToken;
    return await this.authservice.refreshToken(refreshToken, res);
  }

  @Post('forget-password')
  @ApiOperation({ summary: 'Send OTP to reset password' })
  async forgetPassword(@Body() body: { email: string }) {
    return await this.authservice.forgetPassword(body);
  }

  // http://localhost:3000/api/auth/google/login

  // دي اول ايندبوينت اللي المستخدم يكلم بيها السيرفر
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  // ابفنكشن دي يعتبر ملهاش لازمه بس لازم اعملها
  googleLogin() {
    return 'hello';
  }

  //  دي تاني ايند بوينت اللي السيرفر يكلم بيها جوجل وجول يرجعلي الداتا

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  // ابفنكشن دي يعتبر ملهاش لازمه بس لازم اعملها
  googleCallback() {
    //يعني ده الشكل اللي بيطلع بعد ما اسجل  ف جوجل
    return 'user login....';
  }

  //  د عشان تشوف الداتا اللي هو استخدمها وطلعها عنك ف بتاخد منها اللي انت عاوزه وتخزنها ف الداتا بيز
  // googleCallback(@Req() req:any){
  //   const user = req.user
  //   //يعني ده الشكل اللي بيطلع بعد ما اسجل  ف جوجل
  //   return user
  // }
}
