import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateFaqDto {
  @IsString() question: string;
  @IsString() answer: string;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateFaqDto {
  @IsOptional() @IsString() question?: string;
  @IsOptional() @IsString() answer?: string;
  @IsOptional() @IsInt() order?: number;
}
