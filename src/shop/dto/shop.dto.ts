import { IsInt, IsOptional, IsString } from 'class-validator';

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

export class CreateShopSectionDto {
  @IsString() id: string;
  @IsString() name: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateShopSectionDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsInt() order?: number;
}

export class CreateShopItemDto {
  @IsString() id: string;
  @IsString() name: string;
  @IsInt() price: number;
  @IsString() sectionId: string;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateShopItemDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsInt() price?: number;
  @IsOptional() @IsInt() order?: number;
}
