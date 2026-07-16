import { Injectable } from '@nestjs/common';
import { TopicCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.topic.findMany({
      include: {
        createdBy: { select: { name: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.topic.findUnique({
      where: { id },
      include: {
        messages: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async create(
    userId: string,
    title: string,
    category: TopicCategory,
    firstMessage: string,
  ) {
    const topic = await this.prisma.topic.create({
      data: { title, category, createdById: userId },
    });
    await this.prisma.message.create({
      data: { topicId: topic.id, authorId: userId, text: firstMessage },
    });
    return this.findOne(topic.id);
  }

  async addMessage(topicId: string, userId: string, text: string) {
    await this.prisma.message.create({
      data: { topicId, authorId: userId, text },
    });
    return this.findOne(topicId);
  }
}
