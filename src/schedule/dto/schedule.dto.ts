import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateGameDto {
  @IsString() title: string;
  @IsString() master: string;
  @IsString() masterIcon: string;
  @IsString() date: string;
  @IsString() startTime: string;
  @IsString() endTime: string;
  @IsString() gameSystem: string;
  @IsString() format: string;
  @IsOptional() @IsInt() levelMin?: number;
  @IsOptional() @IsInt() levelMax?: number;
  @IsOptional() @IsBoolean() forBeginners?: boolean;
  @IsInt() totalSeats: number;
  @IsOptional() @IsInt() bookedSeats?: number;
  @IsOptional() @IsInt() price?: number;
  @IsOptional() @IsString() currency?: string;
  @IsString() shortDescription: string;
  @IsOptional() @IsString() ageLimit?: string;
}

export class UpdateGameDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() master?: string;
  @IsOptional() @IsString() masterIcon?: string;
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsString() startTime?: string;
  @IsOptional() @IsString() endTime?: string;
  @IsOptional() @IsString() gameSystem?: string;
  @IsOptional() @IsString() format?: string;
  @IsOptional() @IsInt() levelMin?: number;
  @IsOptional() @IsInt() levelMax?: number;
  @IsOptional() @IsBoolean() forBeginners?: boolean;
  @IsOptional() @IsInt() totalSeats?: number;
  @IsOptional() @IsInt() bookedSeats?: number;
  @IsOptional() @IsInt() price?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() ageLimit?: string;
}

export class CreateScheduleHistoryDto {
  @IsString() day: string;
  @IsString() date: string;
  @IsString() name: string;
  @IsString() meta: string;
  @IsString() typeLabel: string;
}

export class UpdateScheduleHistoryDto {
  @IsOptional() @IsString() day?: string;
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() meta?: string;
  @IsOptional() @IsString() typeLabel?: string;
}
