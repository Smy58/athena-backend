import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { Guild } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/guild')
  setGuild(@Req() req: any, @Body('guild') guild: Guild | null) {
    return this.usersService.setGuild(req.user.userId, guild);
  }

  @Get('guild/:guild/members')
  guildMembers(@Param('guild') guild: Guild) {
    return this.usersService.guildMembers(guild);
  }
}
