import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  async signUp(email: string, password: string) {
    return { accessToken: 'accessToken' };
  }

  async signIn(email: string, password: string) {
    return { accessToken: 'accessToken' };
  }
}
