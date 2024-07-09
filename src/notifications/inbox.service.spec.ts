import { TestBed } from '@automock/jest'
import { IInboxService, InboxService } from './inbox.service'
import { IInboxRepository } from './inbox.repository'

describe('InboxService', () => {
  let service: IInboxService
  let inboxRepository: IInboxRepository

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(InboxService).compile()

    service = unit
    inboxRepository = unitRef.get<IInboxRepository>('IInboxRepository')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createLeaveBalanceReminderNotification', () => {
    it('should call InboxRepository.create', async () => {
      await service.createLeaveBalanceReminderNotification('123')
      expect(inboxRepository.create).toHaveBeenCalledTimes(1)
    })
  })

  describe('createBirthdayNotification', () => {
    it('should call InboxRepository.create', async () => {
      await service.createBirthdayNotification('123', 'Bob')
      expect(inboxRepository.create).toHaveBeenCalledTimes(1)
    })
  })
})
