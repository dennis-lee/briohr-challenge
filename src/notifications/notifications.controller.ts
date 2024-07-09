import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  ValidationPipe,
} from '@nestjs/common'
import {
  CreateNotificationDto,
  NotificationType,
} from 'src/notifications/dto/create-notification.dto'
import { IEmailService } from 'src/notifications/email.service'
import { IInboxService } from 'src/notifications/inbox.service'

@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject('IEmailService') private readonly emailService: IEmailService,
    @Inject('IInboxService') private readonly inboxService: IInboxService,
  ) {}

  @Post()
  create(
    @Body(new ValidationPipe({ transform: true }))
    createNotificationDto: CreateNotificationDto,
  ) {
    // TODO: Check subscriptions before sending out
    try {
      switch (createNotificationDto.notificationType) {
        case NotificationType.LEAVE_BALANCE_REMINDER:
          this.inboxService.createLeaveBalanceReminderNotification(
            createNotificationDto.userId,
          )
          this.emailService.sendBirthdayEmail(createNotificationDto.userId)
          break

        case NotificationType.MONTHLY_PAYSLIP:
          this.emailService.sendPayslipEmail(createNotificationDto.userId)
          break

        case NotificationType.HAPPY_BIRTHDAY:
          this.emailService.sendBirthdayEmail(createNotificationDto.userId)
          break
      }

      return {
        statusCode: HttpStatus.CREATED,
      }
    } catch (e) {
      throw new Error('Something went wrong')
    }
  }
}
