import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PurchaseCategory } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminJwtAuthGuard } from '../admin-auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../admin-auth/guards/roles.guard';
import { Roles } from '../admin-auth/decorators/roles.decorator';
import { ShopService } from './shop.service';
import {
  CreateShopTitleDto,
  UpdateShopTitleDto,
  CreateShopItemDto,
  UpdateShopItemDto,
} from './dto/shop.dto';

@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Get('catalog')
  catalog() {
    return this.shopService.catalog();
  }

  @UseGuards(JwtAuthGuard)
  @Post('titles/:id/buy')
  buyTitle(@Req() req: any, @Param('id') id: string) {
    return this.shopService.buyTitle(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('titles/:id/select')
  selectTitle(@Req() req: any, @Param('id') id: string) {
    return this.shopService.selectTitle(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':category/:id/buy')
  buyConsumable(
    @Req() req: any,
    @Param('category') category: PurchaseCategory,
    @Param('id') id: string,
  ) {
    return this.shopService.buyConsumable(req.user.userId, category, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('purchases/pending')
  pending(@Req() req: any) {
    return this.shopService.pendingPurchases(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('purchases/:id/redeem')
  redeem(@Param('id') id: string) {
    return this.shopService.markRedeemed(id);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('titles')
  createTitle(@Body() dto: CreateShopTitleDto) {
    return this.shopService.createTitle(dto);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('titles/:id')
  updateTitle(@Param('id') id: string, @Body() dto: UpdateShopTitleDto) {
    return this.shopService.updateTitle(id, dto);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('titles/:id')
  removeTitle(@Param('id') id: string) {
    return this.shopService.removeTitle(id);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('items')
  createItem(@Body() dto: CreateShopItemDto) {
    return this.shopService.createItem(dto);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() dto: UpdateShopItemDto) {
    return this.shopService.updateItem(id, dto);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('items/:id')
  removeItem(@Param('id') id: string) {
    return this.shopService.removeItem(id);
  }
}
