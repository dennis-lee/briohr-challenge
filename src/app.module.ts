import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { NotificationsModule } from 'src/notifications/notifications.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { HealthModule } from './health/health.module'

const db = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    uri: config.get<string>('MONGODB_URI'),
    dbName: config.get<string>('MONGODB_DATABASE'),
  }),
})

@Module({
  imports: [ConfigModule.forRoot(), db, NotificationsModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
