import { IsArray, IsEmail, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Guild } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsIn(['new', 'mid', 'exp', 'dm']) experience?: string;
  @IsOptional() @IsIn(['TOWER', 'LEAGUE', 'BLADE', 'CANDLE']) guild?: Guild | null;
  @IsOptional() @IsInt() completedContracts?: number;
  @IsOptional() @IsInt() fameStones?: number;
  @IsOptional() @IsInt() finiki?: number;
  @IsOptional() @IsString() activeTitle?: string | null;
  @IsOptional() @IsArray() titles?: string[];
}
