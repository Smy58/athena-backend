import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ReviewType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  find(
    @Query('type') type: ReviewType,
    @Query('eventId') eventId?: string,
    @Query('questId') questId?: string,
  ) {
    return this.reviewsService.findFor(
      type,
      eventId ? Number(eventId) : undefined,
      questId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  upsert(
    @Req() req: any,
    @Body()
    body: {
      type: ReviewType;
      rating: number;
      text: string;
      eventId?: number;
      questId?: string;
    },
  ) {
    return this.reviewsService.upsert(
      req.user.userId,
      body.type,
      body.rating,
      body.text,
      body.eventId,
      body.questId,
    );
  }
}
