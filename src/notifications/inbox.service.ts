import { Injectable } from '@nestjs/common'

export interface IInboxService {
  createLeaveBalanceReminderNotification(userId: string): void
  createBirthdayNotification(userId: string): void
}

@Injectable()
export class InboxService implements IInboxService {
  createLeaveBalanceReminderNotification(userId: string): void {
    console.log(
      `Creating leave balance reminder notification for user: ${userId}`,
    )
  }

  createBirthdayNotification(userId: string): void {
    console.log(`Creating birthday notification for user: ${userId}`)
  }
}
