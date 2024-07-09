import { Module } from '@nestjs/common'
import { NotificationsController } from './notifications.controller'
import { EmailService } from 'src/notifications/email.service'
import { InboxService } from 'src/notifications/inbox.service'

@Module({
  controllers: [NotificationsController],
  providers: [
    {
      provide: 'IEmailService',
      useClass: EmailService,
    },
    {
      provide: 'IInboxService',
      useClass: InboxService,
    },
  ],
})
export class NotificationsModule {}
