import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminJwtAuthGuard } from '../admin-auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../admin-auth/guards/roles.guard';
import { Roles } from '../admin-auth/decorators/roles.decorator';
import { ScheduleService } from './schedule.service';
import {
  CreateGameDto,
  UpdateGameDto,
  CreateScheduleHistoryDto,
  UpdateScheduleHistoryDto,
} from './dto/schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get('meta')
  meta() {
    return this.scheduleService.meta();
  }

  @Get('games')
  listGames() {
    return this.scheduleService.listGames();
  }

  @UseGuards(JwtAuthGuard)
  @Post('games/:id/signup')
  toggleSignup(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.scheduleService.toggleGameSignup(id, req.user.userId);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MASTER')
  @Post('games')
  createGame(@Body() dto: CreateGameDto) {
    return this.scheduleService.createGame(dto);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MASTER')
  @Patch('games/:id')
  updateGame(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGameDto) {
    return this.scheduleService.updateGame(id, dto);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MASTER')
  @Delete('games/:id')
  removeGame(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.removeGame(id);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MASTER')
  @Delete('games/:id/signups/:userId')
  removeGameSignup(@Param('id', ParseIntPipe) id: number, @Param('userId') userId: string) {
    return this.scheduleService.removeGameSignup(id, userId);
  }

  @Get('history')
  listHistory() {
    return this.scheduleService.listHistory();
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MASTER')
  @Post('history')
  createHistory(@Body() dto: CreateScheduleHistoryDto) {
    return this.scheduleService.createHistory(dto);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MASTER')
  @Patch('history/:id')
  updateHistory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateScheduleHistoryDto) {
    return this.scheduleService.updateHistory(id, dto);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MASTER')
  @Delete('history/:id')
  removeHistory(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.removeHistory(id);
  }
}
