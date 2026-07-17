import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAdminUserDto {
  @IsString()
  @MinLength(2)
  login: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsIn(['ADMIN', 'MASTER'])
  role: 'ADMIN' | 'MASTER';
}

export class UpdateAdminUserDto {
  @IsOptional() @IsString() @MinLength(2) login?: string;
  @IsOptional() @IsString() @MinLength(6) password?: string;
  @IsOptional() @IsIn(['ADMIN', 'MASTER']) role?: 'ADMIN' | 'MASTER';
}
