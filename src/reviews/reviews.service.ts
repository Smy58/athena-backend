import { Injectable } from '@nestjs/common';
import { ReviewType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  findFor(type: ReviewType, eventId?: number, questId?: string) {
    return this.prisma.review.findMany({
      where: { type, eventId: eventId ?? undefined, questId: questId ?? undefined },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // One review per user per item: re-submitting updates the existing one.
  upsert(
    userId: string,
    type: ReviewType,
    rating: number,
    text: string,
    eventId?: number,
    questId?: string,
  ) {
    return this.prisma.review.upsert({
      where: {
        type_eventId_questId_authorId: {
          type,
          eventId: eventId ?? null,
          questId: questId ?? null,
          authorId: userId,
        },
      } as any,
      update: { rating, text },
      create: { type, eventId, questId, authorId: userId, rating, text },
    });
  }
}
