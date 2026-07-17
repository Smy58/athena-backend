import { Type } from 'class-transformer';
import { IsDate, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateQuestDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @Type(() => Date) @IsDate() date: Date;
  @IsString() time: string;
  @IsIn(['GOLD', 'ARTIFACT']) rewardType: 'GOLD' | 'ARTIFACT';
  @IsString() rewardValue: string;
}
