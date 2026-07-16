import { IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCharacterDto {
  @IsString() name: string;
  @IsString() species: string;
  @IsOptional() @IsString() speciesTrait?: string;
  @IsString() className: string;
  @IsString() background: string;
  @IsOptional() @IsString() bgFeat?: string;
  @IsOptional() @IsString() bonusNote?: string;

  @IsInt() @Min(1) @Max(20) level: number;

  @IsInt() str: number;
  @IsInt() dex: number;
  @IsInt() con: number;
  @IsInt() int: number;
  @IsInt() wis: number;
  @IsInt() cha: number;

  @IsInt() maxHp: number;
  @IsInt() ac: number;

  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsArray() skills?: string[];
  @IsOptional() @IsArray() saves?: string[];
}
