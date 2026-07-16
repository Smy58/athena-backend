import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  login: string; // name or email

  @IsString()
  password: string;
}
