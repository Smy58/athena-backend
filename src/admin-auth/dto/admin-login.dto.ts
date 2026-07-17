import { IsString } from 'class-validator';

export class AdminLoginDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}
