import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
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

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('games')
  createGame(@Body() dto: CreateGameDto) {
    return this.scheduleService.createGame(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('games/:id')
  updateGame(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGameDto) {
    return this.scheduleService.updateGame(id, dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('games/:id')
  removeGame(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.removeGame(id);
  }

  @Get('history')
  listHistory() {
    return this.scheduleService.listHistory();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('history')
  createHistory(@Body() dto: CreateScheduleHistoryDto) {
    return this.scheduleService.createHistory(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('history/:id')
  updateHistory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateScheduleHistoryDto) {
    return this.scheduleService.updateHistory(id, dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('history/:id')
  removeHistory(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.removeHistory(id);
  }
}
