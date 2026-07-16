import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  findAllForUser(userId: string) {
    return this.prisma.character.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const c = await this.prisma.character.findUnique({
      where: { id },
      include: {
        inventory: true,
        notes: true,
        rollHistory: { take: 25, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!c) throw new NotFoundException('Персонаж не найден');
    if (c.userId !== userId) throw new ForbiddenException();
    return c;
  }

  create(userId: string, dto: CreateCharacterDto) {
    return this.prisma.character.create({
      data: { ...dto, userId, curHp: dto.maxHp, tempHp: 0 },
    });
  }

  async update(
    userId: string,
    id: string,
    data: Partial<CreateCharacterDto> & Record<string, any>,
  ) {
    await this.findOne(userId, id); // ownership check, throws if not owner
    return this.prisma.character.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.character.delete({ where: { id } });
  }
}
