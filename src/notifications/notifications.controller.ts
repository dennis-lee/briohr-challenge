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
import { IIdentityService } from 'src/notifications/identity.service'
import { IInboxService } from 'src/notifications/inbox.service'

@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject('IEmailService') private readonly emailService: IEmailService,
    @Inject('IInboxService') private readonly inboxService: IInboxService,
    @Inject('IIdentityService')
    private readonly identityService: IIdentityService,
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createNotificationDto: CreateNotificationDto,
  ) {
    try {
      const companySettings = await this.identityService.getCompanySettings(
        createNotificationDto.companyId,
      )
      const userSettings = await this.identityService.getUserSettings(
        createNotificationDto.userId,
      )

      switch (createNotificationDto.notificationType) {
        case NotificationType.LEAVE_BALANCE_REMINDER:
          if (
            companySettings.notificationChannelsEnabled.inbox &&
            userSettings.notificationChannelsEnabled.inbox
          ) {
            this.inboxService.createLeaveBalanceReminderNotification(
              createNotificationDto.userId,
            )
          }

          if (
            companySettings.notificationChannelsEnabled.email &&
            userSettings.notificationChannelsEnabled.email
          ) {
            this.emailService.sendBirthdayEmail(createNotificationDto.userId)
          }
          break

        case NotificationType.MONTHLY_PAYSLIP:
          if (
            companySettings.notificationChannelsEnabled.email &&
            userSettings.notificationChannelsEnabled.email
          ) {
            this.emailService.sendPayslipEmail(createNotificationDto.userId)
          }

          break

        case NotificationType.HAPPY_BIRTHDAY:
          if (
            companySettings.notificationChannelsEnabled.email &&
            userSettings.notificationChannelsEnabled.email
          ) {
            this.emailService.sendBirthdayEmail(createNotificationDto.userId)
          }

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
