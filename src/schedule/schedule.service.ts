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

  // bookedSeats is always derived from the real signup rows — never stored —
  // so it can never drift from who's actually signed up (same reasoning as
  // the guild jar total being summed from GuildContract rather than cached).
  async listGames() {
    const games = await this.prisma.game.findMany({
      include: { signups: { include: { user: { select: { id: true, name: true } } } } },
      orderBy: { id: 'asc' },
    });
    return games.map((g) => ({ ...g, bookedSeats: g.signups.length }));
  }

  async toggleGameSignup(gameId: number, userId: string) {
    const existing = await this.prisma.gameSignup.findUnique({
      where: { gameId_userId: { gameId, userId } },
    });
    if (existing) {
      await this.prisma.gameSignup.delete({ where: { id: existing.id } });
      return { signedUp: false };
    }

    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Игра не найдена');
    const bookedSeats = await this.prisma.gameSignup.count({ where: { gameId } });
    if (bookedSeats >= game.totalSeats) {
      throw new BadRequestException('Свободных мест не осталось');
    }

    await this.prisma.gameSignup.create({ data: { gameId, userId } });
    return { signedUp: true };
  }

  async addGameSignup(gameId: number, userId: string) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Игра не найдена');
    const bookedSeats = await this.prisma.gameSignup.count({ where: { gameId } });
    if (bookedSeats >= game.totalSeats) {
      throw new BadRequestException('Свободных мест не осталось');
    }

    const existing = await this.prisma.gameSignup.findUnique({
      where: { gameId_userId: { gameId, userId } },
    });
    if (existing) throw new BadRequestException('Игрок уже записан на эту игру');

    await this.prisma.gameSignup.create({ data: { gameId, userId } });
  }

  async removeGameSignup(gameId: number, userId: string) {
    const existing = await this.prisma.gameSignup.findUnique({
      where: { gameId_userId: { gameId, userId } },
    });
    if (!existing) throw new NotFoundException('Запись не найдена');

    await this.prisma.gameSignup.delete({ where: { id: existing.id } });
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
