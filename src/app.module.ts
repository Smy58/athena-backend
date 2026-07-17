import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CharactersModule } from './characters/characters.module';
import { QuestsModule } from './quests/quests.module';
import { GuildModule } from './guild/guild.module';
import { ShopModule } from './shop/shop.module';
import { SupportModule } from './support/support.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FaqModule } from './faq/faq.module';
import { MastersModule } from './masters/masters.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CharactersModule,
    QuestsModule,
    GuildModule,
    ShopModule,
    SupportModule,
    ReviewsModule,
    FaqModule,
    MastersModule,
    ScheduleModule,
    AdminAuthModule,
  ],
})
export class AppModule {}
