import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { omitPasswordHash } from '../common/omit-password';
import {
  CreateShopTitleDto,
  UpdateShopTitleDto,
  CreateShopSectionDto,
  UpdateShopSectionDto,
  CreateShopItemDto,
  UpdateShopItemDto,
} from './dto/shop.dto';

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  async catalog() {
    const [titles, sections] = await Promise.all([
      this.prisma.shopTitle.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.shopSection.findMany({
        orderBy: { order: 'asc' },
        include: { items: { orderBy: { order: 'asc' } } },
      }),
    ]);
    return { titles, sections };
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

  async buyConsumable(userId: string, itemId: string) {
    const item = await this.prisma.shopItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Товар не найден');

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.finiki < item.price) throw new BadRequestException('Недостаточно фиников');

    await this.prisma.user.update({
      where: { id: userId },
      data: { finiki: { decrement: item.price } },
    });

    return this.prisma.purchase.create({
      data: {
        userId,
        itemId: item.id,
        name: item.name,
        sectionId: item.sectionId,
        price: item.price,
      },
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

  listSections() {
    return this.prisma.shopSection.findMany({
      orderBy: { order: 'asc' },
      include: { items: { orderBy: { order: 'asc' } } },
    });
  }

  createSection(dto: CreateShopSectionDto) {
    return this.prisma.shopSection.create({ data: dto });
  }

  updateSection(id: string, dto: UpdateShopSectionDto) {
    return this.prisma.shopSection.update({ where: { id }, data: dto });
  }

  removeSection(id: string) {
    // ShopItem.sectionId has onDelete: Cascade, so this also removes the section's items
    return this.prisma.shopSection.delete({ where: { id } });
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
