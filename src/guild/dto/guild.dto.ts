import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateGuildInfoDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() bonus?: string;
  @IsOptional() @IsString() rank3?: string;
}

export class CreateGuildRankDto {
  @IsString() value: string;
  @IsString() label: string;
  @IsInt() fameStones: number;
  @IsInt() finiki: number;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateGuildRankDto {
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsInt() fameStones?: number;
  @IsOptional() @IsInt() finiki?: number;
  @IsOptional() @IsInt() order?: number;
}
