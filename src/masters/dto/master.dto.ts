import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMasterDto {
  @IsString() name: string;
  @IsString() icon: string;
  @IsString() status: string;
  @IsString() experienceLevel: string;
  @IsOptional() @IsInt() gamesHostedCount?: number;
  @IsOptional() @IsArray() systems?: string[];
  @IsOptional() @IsArray() genres?: string[];
  @IsOptional() @IsArray() styleTags?: string[];
  @IsOptional() @IsBoolean() beginnerFriendly?: boolean;
  @IsString() shortDescription: string;
  @IsString() fullDescription: string;
  @IsOptional() @IsArray() pastGames?: { title: string; date: string }[];
}

export class UpdateMasterDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() experienceLevel?: string;
  @IsOptional() @IsInt() gamesHostedCount?: number;
  @IsOptional() @IsArray() systems?: string[];
  @IsOptional() @IsArray() genres?: string[];
  @IsOptional() @IsArray() styleTags?: string[];
  @IsOptional() @IsBoolean() beginnerFriendly?: boolean;
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() fullDescription?: string;
  @IsOptional() @IsArray() pastGames?: { title: string; date: string }[];
}
