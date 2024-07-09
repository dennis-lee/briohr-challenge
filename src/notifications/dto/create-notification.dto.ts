import { Expose } from 'class-transformer'
import { IsEnum } from 'class-validator'

export enum NotificationType {
  LEAVE_BALANCE_REMINDER = 'leave-balance-reminder',
  MONTHLY_PAYSLIP = 'monthly-payslip',
  HAPPY_BIRTHDAY = 'happy-birthday',
}

export class CreateNotificationDto {
  @Expose({ name: 'company_id' })
  companyId: string

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'notification_type' })
  @IsEnum(NotificationType)
  notificationType: NotificationType
}
