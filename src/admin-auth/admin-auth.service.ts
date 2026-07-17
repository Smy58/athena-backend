import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CreateAdminUserDto, UpdateAdminUserDto } from './dto/admin-user.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: AdminLoginDto) {
    const admin = await this.prisma.adminUser.findUnique({ where: { login: dto.login } });
    if (!admin) throw new UnauthorizedException('Неверный логин или пароль');

    const valid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('Неверный логин или пароль');

    const token = this.jwt.sign({ sub: admin.id, role: admin.role, type: 'admin' });
    return {
      token,
      user: { id: admin.id, login: admin.login, role: admin.role },
    };
  }

  list() {
    return this.prisma.adminUser.findMany({
      select: { id: true, login: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(dto: CreateAdminUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const admin = await this.prisma.adminUser.create({
      data: { login: dto.login, passwordHash, role: dto.role },
    });
    const { passwordHash: _, ...safe } = admin;
    return safe;
  }

  async update(id: string, dto: UpdateAdminUserDto) {
    const data: { login?: string; role?: 'ADMIN' | 'MASTER'; passwordHash?: string } = {};
    if (dto.login) data.login = dto.login;
    if (dto.role) data.role = dto.role;
    if (dto.password) data.passwordHash = await bcrypt.hash(dto.password, 10);

    const admin = await this.prisma.adminUser.update({ where: { id }, data });
    const { passwordHash: _, ...safe } = admin;
    return safe;
  }

  async remove(id: string, requestingAdminId: string) {
    if (id === requestingAdminId) {
      throw new BadRequestException('Нельзя удалить свой собственный аккаунт');
    }

    const target = await this.prisma.adminUser.findUnique({ where: { id } });
    if (target?.role === 'ADMIN') {
      const adminCount = await this.prisma.adminUser.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        throw new BadRequestException('Нельзя удалить последнего администратора');
      }
    }

    await this.prisma.adminUser.delete({ where: { id } });
  }
}
