import { Body, Post, Controller, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('sign-up')
  @ApiCreatedResponse()
  async signUp(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { accessToken } = await this.authService.signUp(
      body.email,
      body.password,
    );

    this.cookieService.setToken(res, accessToken);
  }

  @Post('sign-in')
  @ApiOkResponse()
  async signIn(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { accessToken } = await this.authService.signIn(
      body.email,
      body.password,
    );

    this.cookieService.setToken(res, accessToken);
  }

  @Post('sign-out')
  @ApiOkResponse()
  async signOut(@Res({ passthrough: true }) res: Response) {
    this.cookieService.removeToken(res);
  }

  // TODO: Session Endpoint
}
