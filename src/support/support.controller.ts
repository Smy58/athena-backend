import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TopicCategory } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SupportService } from './support.service';

@Controller('support/topics')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Get()
  findAll() {
    return this.supportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: any,
    @Body() body: { title: string; category: TopicCategory; message: string },
  ) {
    return this.supportService.create(
      req.user.userId,
      body.title,
      body.category,
      body.message,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/messages')
  addMessage(@Req() req: any, @Param('id') id: string, @Body('text') text: string) {
    return this.supportService.addMessage(id, req.user.userId, text);
  }
}
