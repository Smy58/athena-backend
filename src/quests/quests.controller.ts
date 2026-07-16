import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuestsService } from './quests.service';

@Controller('quests')
export class QuestsController {
  constructor(private questsService: QuestsService) {}

  @Get('active')
  active() {
    return this.questsService.findActive();
  }

  @Get('completed')
  completed() {
    return this.questsService.findCompleted();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() data: any) {
    return this.questsService.create(req.user.userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/signup')
  toggleSignup(@Req() req: any, @Param('id') id: string) {
    return this.questsService.toggleSignup(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  complete(@Param('id') id: string) {
    return this.questsService.complete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questsService.remove(id);
  }
}
