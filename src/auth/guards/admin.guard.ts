import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// Runs after JwtAuthGuard. Checks isAdmin live against the DB rather than
// trusting a JWT claim, since jwt.strategy.ts only embeds { userId, name }.
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = await this.prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user?.isAdmin) throw new ForbiddenException('Требуются права администратора');
    return true;
  }
}
