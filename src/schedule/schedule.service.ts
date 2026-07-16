import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GAME_FORMATS, GAME_SYSTEMS } from './schedule.constants';
import {
  CreateGameDto,
  UpdateGameDto,
  CreateScheduleHistoryDto,
  UpdateScheduleHistoryDto,
} from './dto/schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  meta() {
    return { formats: GAME_FORMATS, systems: GAME_SYSTEMS };
  }

  listGames() {
    return this.prisma.game.findMany({ orderBy: { id: 'asc' } });
  }

  createGame(dto: CreateGameDto) {
    return this.prisma.game.create({ data: dto });
  }

  updateGame(id: number, dto: UpdateGameDto) {
    return this.prisma.game.update({ where: { id }, data: dto });
  }

  removeGame(id: number) {
    return this.prisma.game.delete({ where: { id } });
  }

  listHistory() {
    return this.prisma.scheduleHistory.findMany({ orderBy: { id: 'asc' } });
  }

  createHistory(dto: CreateScheduleHistoryDto) {
    return this.prisma.scheduleHistory.create({ data: dto });
  }

  updateHistory(id: number, dto: UpdateScheduleHistoryDto) {
    return this.prisma.scheduleHistory.update({ where: { id }, data: dto });
  }

  removeHistory(id: number) {
    return this.prisma.scheduleHistory.delete({ where: { id } });
  }
}
