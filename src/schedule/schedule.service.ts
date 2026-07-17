import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prisma.game.findMany({
      include: { signups: { include: { user: { select: { id: true, name: true } } } } },
      orderBy: { id: 'asc' },
    });
  }

  async toggleGameSignup(gameId: number, userId: string) {
    const existing = await this.prisma.gameSignup.findUnique({
      where: { gameId_userId: { gameId, userId } },
    });
    if (existing) {
      await this.prisma.gameSignup.delete({ where: { id: existing.id } });
      await this.prisma.game.update({ where: { id: gameId }, data: { bookedSeats: { decrement: 1 } } });
      return { signedUp: false };
    }

    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Игра не найдена');
    if (game.bookedSeats >= game.totalSeats) {
      throw new BadRequestException('Свободных мест не осталось');
    }

    await this.prisma.gameSignup.create({ data: { gameId, userId } });
    await this.prisma.game.update({ where: { id: gameId }, data: { bookedSeats: { increment: 1 } } });
    return { signedUp: true };
  }

  async removeGameSignup(gameId: number, userId: string) {
    const existing = await this.prisma.gameSignup.findUnique({
      where: { gameId_userId: { gameId, userId } },
    });
    if (!existing) throw new NotFoundException('Запись не найдена');

    await this.prisma.gameSignup.delete({ where: { id: existing.id } });
    await this.prisma.game.update({ where: { id: gameId }, data: { bookedSeats: { decrement: 1 } } });
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
