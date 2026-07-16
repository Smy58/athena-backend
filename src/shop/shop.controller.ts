import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PurchaseCategory } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShopService } from './shop.service';

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
}
