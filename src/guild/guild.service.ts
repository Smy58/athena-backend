import { Injectable, NotFoundException } from '@nestjs/common';
import { Guild } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { omitPasswordHash } from '../common/omit-password';
import { UpdateGuildInfoDto, CreateGuildRankDto, UpdateGuildRankDto } from './dto/guild.dto';

const JAR_CAPACITY = 30;

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService) {}

  async logContract(userId: string, guild: Guild, rank: string) {
    const rankInfo = await this.prisma.guildRank.findUnique({ where: { value: rank } });
    if (!rankInfo) throw new NotFoundException('Неизвестный ранг контракта');
    const { fameStones, finiki } = rankInfo;

    await this.prisma.guildContract.create({
      data: { userId, guild, rank, fameStones, finiki },
    });

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fameStones: { increment: fameStones },
        finiki: { increment: finiki },
        ...(rank !== 'fail' ? { completedContracts: { increment: 1 } } : {}),
      },
    });
    return omitPasswordHash(updated);
  }

  // The jar total is derived from the contract log itself, not a separate
  // counter — this way it can never drift out of sync with individual records.
  async jarStatus(guild: Guild) {
    const result = await this.prisma.guildContract.aggregate({
      where: { guild },
      _sum: { fameStones: true },
    });
    const total = result._sum.fameStones ?? 0;
    return {
      guild,
      total,
      capacity: JAR_CAPACITY,
      percent: Math.min(100, Math.round((total / JAR_CAPACITY) * 100)),
    };
  }

  listInfo() {
    return this.prisma.guildInfo.findMany();
  }

  updateInfo(guild: Guild, dto: UpdateGuildInfoDto) {
    return this.prisma.guildInfo.update({ where: { guild }, data: dto });
  }

  listRanks() {
    return this.prisma.guildRank.findMany({ orderBy: { order: 'asc' } });
  }

  createRank(dto: CreateGuildRankDto) {
    return this.prisma.guildRank.create({ data: dto });
  }

  updateRank(value: string, dto: UpdateGuildRankDto) {
    return this.prisma.guildRank.update({ where: { value }, data: dto });
  }

  removeRank(value: string) {
    return this.prisma.guildRank.delete({ where: { value } });
  }
}
