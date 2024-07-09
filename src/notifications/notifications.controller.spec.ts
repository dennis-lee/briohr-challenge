import { NotificationsController } from './notifications.controller'
import { IEmailService } from './email.service'
import { NotificationType } from './dto/create-notification.dto'
import { IIdentityService } from './identity.service'

import { IInboxService } from './inbox.service'

import { TestBed } from '@automock/jest'

describe('NotificationsController', () => {
  let controller: NotificationsController
  let emailService: jest.Mocked<IEmailService>
  let identityService: jest.Mocked<IIdentityService>
  let inboxService: jest.Mocked<IInboxService>

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(NotificationsController).compile()

    controller = unit
    emailService = unitRef.get<IEmailService>('IEmailService')
    identityService = unitRef.get<IIdentityService>('IIdentityService')
    inboxService = unitRef.get<IInboxService>('IInboxService')

    identityService.getCompanySettings.mockResolvedValue({
      notificationChannelsEnabled: {
        email: true,
        inbox: true,
      },
    })

    identityService.getUserSettings.mockResolvedValue({
      profile: {
        name: 'John',
      },
      notificationChannelsEnabled: {
        email: true,
        inbox: true,
      },
    })
  })

  it('should call email service when the notification type is monthly-payslip or happy-birthday', async () => {
    const monthlyPayslipReq = {
      companyId: '123',
      userId: '456',
      notificationType: NotificationType.MONTHLY_PAYSLIP,
    }

    const birthdayReq = {
      companyId: '123',
      userId: '456',
      notificationType: NotificationType.HAPPY_BIRTHDAY,
    }

    const sendPayslipFunc = jest.spyOn(emailService, 'sendPayslipEmail')
    const sendBirthdayEmailFunc = jest.spyOn(emailService, 'sendBirthdayEmail')

    await controller.create(monthlyPayslipReq)
    expect(sendPayslipFunc).toHaveBeenCalledTimes(1)

    await controller.create(birthdayReq)
    expect(sendBirthdayEmailFunc).toHaveBeenCalledTimes(1)
  })

  it('should call inbox service when the notification type is leave-balance-reminder or happy-birthday', async () => {
    const leaveBalanceReminderReq = {
      companyId: '123',
      userId: '456',
      notificationType: NotificationType.LEAVE_BALANCE_REMINDER,
    }

    const birthdayReq = {
      companyId: '123',
      userId: '456',
      notificationType: NotificationType.HAPPY_BIRTHDAY,
    }

    const createLeaveBalanceReminderFunc = jest.spyOn(
      inboxService,
      'createLeaveBalanceReminderNotification',
    )
    const createBirthdayNotifFunc = jest.spyOn(
      inboxService,
      'createBirthdayNotification',
    )

    await controller.create(leaveBalanceReminderReq)
    expect(createLeaveBalanceReminderFunc).toHaveBeenCalledTimes(1)

    await controller.create(birthdayReq)
    expect(createBirthdayNotifFunc).toHaveBeenCalledTimes(1)
  })

  it('should not call email or inbox service when company email and inbox notification channels are not enabled', async () => {
    identityService.getCompanySettings.mockResolvedValueOnce({
      notificationChannelsEnabled: {
        email: false,
        inbox: false,
      },
    })

    const birthdayReq = {
      companyId: '123',
      userId: '456',
      notificationType: NotificationType.HAPPY_BIRTHDAY,
    }

    const sendBirthdayEmailFunc = jest.spyOn(emailService, 'sendBirthdayEmail')
    const createBirthdayNotifFunc = jest.spyOn(
      inboxService,
      'createBirthdayNotification',
    )

    await controller.create(birthdayReq)
    expect(sendBirthdayEmailFunc).toHaveBeenCalledTimes(0)
    expect(createBirthdayNotifFunc).toHaveBeenCalledTimes(0)
  })

  it('should not call email or inbox service when user email and inbox notification channels are not enabled', async () => {
    identityService.getUserSettings.mockResolvedValue({
      profile: {
        name: 'John',
      },
      notificationChannelsEnabled: {
        email: false,
        inbox: false,
      },
    })

    const birthdayReq = {
      companyId: '123',
      userId: '456',
      notificationType: NotificationType.HAPPY_BIRTHDAY,
    }

    const sendBirthdayEmailFunc = jest.spyOn(emailService, 'sendBirthdayEmail')
    const createBirthdayNotifFunc = jest.spyOn(
      inboxService,
      'createBirthdayNotification',
    )

    await controller.create(birthdayReq)
    expect(sendBirthdayEmailFunc).toHaveBeenCalledTimes(0)
    expect(createBirthdayNotifFunc).toHaveBeenCalledTimes(0)
  })
})
