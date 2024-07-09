import { Module } from '@nestjs/common'
import { NotificationsController } from './notifications.controller'
import { EmailService } from 'src/notifications/email.service'
import { InboxService } from 'src/notifications/inbox.service'
import { IdentityService } from 'src/notifications/identity.service'
import { ConfigModule } from '@nestjs/config'
import { InboxRepository } from 'src/notifications/inbox.repository'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Notification,
  NotificationSchema,
} from 'src/notifications/schemas/notification.schema'

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [
    { provide: 'IInboxRepository', useClass: InboxRepository },
    {
      provide: 'IEmailService',
      useClass: EmailService,
    },
    {
      provide: 'IInboxService',
      useClass: InboxService,
    },
    {
      provide: 'IIdentityService',
      useClass: IdentityService,
    },
  ],
})
export class NotificationsModule {}
