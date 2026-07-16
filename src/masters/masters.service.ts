import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDto, UpdateMasterDto } from './dto/master.dto';

@Injectable()
export class MastersService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.master.findMany({ orderBy: { id: 'asc' } });
  }

  create(dto: CreateMasterDto) {
    return this.prisma.master.create({ data: dto });
  }

  update(id: number, dto: UpdateMasterDto) {
    return this.prisma.master.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.master.delete({ where: { id } });
  }
}
