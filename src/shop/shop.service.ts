import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PurchaseCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { omitPasswordHash } from '../common/omit-password';
import { SHOP_TITLES, SHOP_POTIONS, SHOP_SNACKS } from './shop.catalog';

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  catalog() {
    return { titles: SHOP_TITLES, potions: SHOP_POTIONS, snacks: SHOP_SNACKS };
  }

  async buyTitle(userId: string, titleId: string) {
    const title = SHOP_TITLES.find((t) => t.id === titleId);
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
    const list = category === 'POTION' ? SHOP_POTIONS : SHOP_SNACKS;
    const item = list.find((i) => i.id === itemId);
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
}
