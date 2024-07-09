import { Inject, Injectable } from '@nestjs/common'
import { IInboxRepository } from 'src/notifications/inbox.repository'
import {
  notificationBirthdayTemplate,
  notificationLeaveBalanceReminderTemplate,
} from 'src/notifications/utils/constants'

export interface IInboxService {
  createLeaveBalanceReminderNotification(userId: string): void
  createBirthdayNotification(userId: string, name: string): void
}

@Injectable()
export class InboxService implements IInboxService {
  constructor(
    @Inject('IInboxRepository')
    private readonly inboxRepository: IInboxRepository,
  ) {}

  async createLeaveBalanceReminderNotification(userId: string): Promise<void> {
    try {
      await this.inboxRepository.create(
        userId,
        notificationLeaveBalanceReminderTemplate(),
      )
    } catch (e) {
      throw e
    }
  }

  async createBirthdayNotification(
    userId: string,
    name: string,
  ): Promise<void> {
    try {
      await this.inboxRepository.create(
        userId,
        notificationBirthdayTemplate({ name }),
      )
    } catch (e) {
      throw e
    }
  }
}
