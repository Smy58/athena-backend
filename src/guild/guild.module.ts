import { Module } from '@nestjs/common';
import { GuildService } from './guild.service';
import { GuildController } from './guild.controller';

@Module({
  providers: [GuildService],
  controllers: [GuildController],
})
export class GuildModule {}
