import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Guild } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { GuildService } from './guild.service';
import { UpdateGuildInfoDto, CreateGuildRankDto, UpdateGuildRankDto } from './dto/guild.dto';

@Controller('guild')
export class GuildController {
  constructor(private guildService: GuildService) {}

  @UseGuards(JwtAuthGuard)
  @Post('contract')
  logContract(@Req() req: any, @Body() body: { guild: Guild; rank: string }) {
    return this.guildService.logContract(req.user.userId, body.guild, body.rank);
  }

  @Get(':guild/jar')
  jar(@Param('guild') guild: Guild) {
    return this.guildService.jarStatus(guild);
  }

  @Get('info')
  listInfo() {
    return this.guildService.listInfo();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('info/:guild')
  updateInfo(@Param('guild') guild: Guild, @Body() dto: UpdateGuildInfoDto) {
    return this.guildService.updateInfo(guild, dto);
  }

  @Get('ranks')
  listRanks() {
    return this.guildService.listRanks();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('ranks')
  createRank(@Body() dto: CreateGuildRankDto) {
    return this.guildService.createRank(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('ranks/:value')
  updateRank(@Param('value') value: string, @Body() dto: UpdateGuildRankDto) {
    return this.guildService.updateRank(value, dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('ranks/:value')
  removeRank(@Param('value') value: string) {
    return this.guildService.removeRank(value);
  }
}
