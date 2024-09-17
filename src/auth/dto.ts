import { ApiProperty } from '@nestjs/swagger';

export class SignUpBodyDto {
  @ApiProperty({
    example: 'test@test.ru',
  })
  email: string;

  @ApiProperty({
    example: 'testpassword',
  })
  password: string;
}

export class SignInBodyDto {
  @ApiProperty({
    example: 'test@test.ru',
  })
  email: string;

  @ApiProperty({
    example: 'testpassword',
  })
  password: string;
}

export class GetSessionInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  'iat': number;

  @ApiProperty()
  'exp': number;
}
