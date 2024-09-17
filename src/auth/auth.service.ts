import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) throw new BadRequestException({ type: 'email-exist' });

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(password, salt);

    const newUser = await this.usersService.create(email, hash, salt);

    const accessToken = await this.jwtService.signAsync(
      {
        id: newUser.id,
        email: newUser.email,
      },
      { secret: process.env.JWT_SECRET },
    );

    return { accessToken };
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException();

    const hash = this.passwordService.getHash(password, user.salt);

    if (hash !== user.hash) throw new UnauthorizedException();

    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      { secret: process.env.JWT_SECRET },
    );

    return { accessToken };
  }
}
