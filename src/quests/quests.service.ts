import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestsService {
  constructor(private prisma: PrismaService) {}

  findActive() {
    return this.prisma.quest.findMany({
      where: { completed: false },
      include: {
        signups: { include: { user: { select: { id: true, name: true } } } },
        createdBy: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findCompleted() {
    return this.prisma.quest.findMany({
      where: { completed: true },
      include: {
        signups: { include: { user: { select: { id: true, name: true } } } },
        createdBy: { select: { name: true } },
        reviews: true,
      },
      orderBy: { completedAt: 'desc' },
    });
  }

  create(userId: string, data: any) {
    return this.prisma.quest.create({ data: { ...data, createdById: userId } });
  }

  async toggleSignup(questId: string, userId: string) {
    const existing = await this.prisma.questSignup.findUnique({
      where: { questId_userId: { questId, userId } },
    });
    if (existing) {
      await this.prisma.questSignup.delete({ where: { id: existing.id } });
      return { signedUp: false };
    }
    await this.prisma.questSignup.create({ data: { questId, userId } });
    return { signedUp: true };
  }

  async removeSignup(questId: string, userId: string) {
    const existing = await this.prisma.questSignup.findUnique({
      where: { questId_userId: { questId, userId } },
    });
    if (!existing) throw new NotFoundException('Запись не найдена');
    await this.prisma.questSignup.delete({ where: { id: existing.id } });
  }

  async complete(questId: string) {
    const quest = await this.prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) throw new NotFoundException('Задание не найдено');
    return this.prisma.quest.update({
      where: { id: questId },
      data: { completed: true, completedAt: new Date() },
    });
  }

  remove(questId: string) {
    return this.prisma.quest.delete({ where: { id: questId } });
  }
}
