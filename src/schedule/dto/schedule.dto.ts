import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateGameDto {
  @IsString() title: string;
  @IsString() master: string;
  @IsString() masterIcon: string;
  @Type(() => Date) @IsDate() date: Date;
  @IsString() startTime: string;
  @IsString() endTime: string;
  @IsString() gameSystem: string;
  @IsString() format: string;
  @IsOptional() @IsInt() levelMin?: number;
  @IsOptional() @IsInt() levelMax?: number;
  @IsOptional() @IsBoolean() forBeginners?: boolean;
  @IsInt() totalSeats: number;
  @IsOptional() @IsInt() price?: number;
  @IsOptional() @IsString() currency?: string;
  @IsString() shortDescription: string;
  @IsOptional() @IsString() ageLimit?: string;
}

export class UpdateGameDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() master?: string;
  @IsOptional() @IsString() masterIcon?: string;
  @IsOptional() @Type(() => Date) @IsDate() date?: Date;
  @IsOptional() @IsString() startTime?: string;
  @IsOptional() @IsString() endTime?: string;
  @IsOptional() @IsString() gameSystem?: string;
  @IsOptional() @IsString() format?: string;
  @IsOptional() @IsInt() levelMin?: number;
  @IsOptional() @IsInt() levelMax?: number;
  @IsOptional() @IsBoolean() forBeginners?: boolean;
  @IsOptional() @IsInt() totalSeats?: number;
  @IsOptional() @IsInt() price?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() ageLimit?: string;
}

export class CreateScheduleHistoryDto {
  @Type(() => Date) @IsDate() date: Date;
  @IsString() name: string;
  @IsString() meta: string;
  @IsString() typeLabel: string;
}

export class UpdateScheduleHistoryDto {
  @IsOptional() @Type(() => Date) @IsDate() date?: Date;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() meta?: string;
  @IsOptional() @IsString() typeLabel?: string;
}
