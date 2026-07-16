import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Guild } from '@prisma/client';
import { omitPasswordHash } from '../common/omit-password';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    const { passwordHash, ...safe } = user;
    return safe;
  }

  async setGuild(userId: string, guild: Guild | null) {
    const updated = await this.prisma.user.update({ where: { id: userId }, data: { guild } });
    return omitPasswordHash(updated);
  }

  guildMembers(guild: Guild) {
    return this.prisma.user.findMany({
      where: { guild },
      select: {
        id: true,
        name: true,
        completedContracts: true,
        fameStones: true,
        activeTitle: true,
      },
      orderBy: { fameStones: 'desc' },
    });
  }
}
