import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateShopTitleDto {
  @IsString() id: string;
  @IsString() name: string;
  @IsInt() price: number;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateShopTitleDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsInt() price?: number;
  @IsOptional() @IsInt() order?: number;
}

export class CreateShopItemDto {
  @IsString() id: string;
  @IsString() name: string;
  @IsInt() price: number;
  @IsIn(['POTION', 'SNACK']) category: 'POTION' | 'SNACK';
  @IsOptional() @IsInt() order?: number;
}

export class UpdateShopItemDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsInt() price?: number;
  @IsOptional() @IsInt() order?: number;
}
