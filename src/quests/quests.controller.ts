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
import { AdminJwtAuthGuard } from '../admin-auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../admin-auth/guards/roles.guard';
import { Roles } from '../admin-auth/decorators/roles.decorator';
import { QuestsService } from './quests.service';
import { CreateQuestDto } from './dto/create-quest.dto';

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
  create(@Req() req: any, @Body() dto: CreateQuestDto) {
    return this.questsService.create(req.user.userId, dto);
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

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MASTER')
  @Delete(':id/signups/:userId')
  removeSignup(@Param('id') id: string, @Param('userId') userId: string) {
    return this.questsService.removeSignup(id, userId);
  }
}
