import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PurchaseCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { omitPasswordHash } from '../common/omit-password';
import {
  CreateShopTitleDto,
  UpdateShopTitleDto,
  CreateShopItemDto,
  UpdateShopItemDto,
} from './dto/shop.dto';

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  async catalog() {
    const [titles, potions, snacks] = await Promise.all([
      this.prisma.shopTitle.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.shopItem.findMany({ where: { category: 'POTION' }, orderBy: { order: 'asc' } }),
      this.prisma.shopItem.findMany({ where: { category: 'SNACK' }, orderBy: { order: 'asc' } }),
    ]);
    return { titles, potions, snacks };
  }

  async buyTitle(userId: string, titleId: string) {
    const title = await this.prisma.shopTitle.findUnique({ where: { id: titleId } });
    if (!title) throw new NotFoundException('Звание не найдено');

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.titles.includes(titleId)) return omitPasswordHash(user); // already owned, no-op
    if (user.finiki < title.price) throw new BadRequestException('Недостаточно фиников');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        finiki: { decrement: title.price },
        titles: { push: titleId },
        activeTitle: user.activeTitle ?? titleId,
      },
    });
    return omitPasswordHash(updated);
  }

  async selectTitle(userId: string, titleId: string) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { activeTitle: titleId },
    });
    return omitPasswordHash(updated);
  }

  async buyConsumable(
    userId: string,
    category: PurchaseCategory,
    itemId: string,
  ) {
    const item = await this.prisma.shopItem.findFirst({ where: { id: itemId, category } });
    if (!item) throw new NotFoundException('Товар не найден');

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.finiki < item.price) throw new BadRequestException('Недостаточно фиников');

    await this.prisma.user.update({
      where: { id: userId },
      data: { finiki: { decrement: item.price } },
    });

    return this.prisma.purchase.create({
      data: { userId, itemId: item.id, name: item.name, category, price: item.price },
    });
  }

  pendingPurchases(userId: string) {
    return this.prisma.purchase.findMany({
      where: { userId, redeemed: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  markRedeemed(purchaseId: string) {
    return this.prisma.purchase.update({
      where: { id: purchaseId },
      data: { redeemed: true },
    });
  }

  createTitle(dto: CreateShopTitleDto) {
    return this.prisma.shopTitle.create({ data: dto });
  }

  updateTitle(id: string, dto: UpdateShopTitleDto) {
    return this.prisma.shopTitle.update({ where: { id }, data: dto });
  }

  removeTitle(id: string) {
    return this.prisma.shopTitle.delete({ where: { id } });
  }

  createItem(dto: CreateShopItemDto) {
    return this.prisma.shopItem.create({ data: dto });
  }

  updateItem(id: string, dto: UpdateShopItemDto) {
    return this.prisma.shopItem.update({ where: { id }, data: dto });
  }

  removeItem(id: string) {
    return this.prisma.shopItem.delete({ where: { id } });
  }
}
