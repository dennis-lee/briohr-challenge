import * as mongoose from 'mongoose'
import { model } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { InboxRepository } from './inbox.repository'
import {
  NotificationDocument,
  NotificationSchema,
} from './schemas/notification.schema'

const notificationModel = model<NotificationDocument>(
  'Notification',
  NotificationSchema,
)
describe('InboxRepository', () => {
  let con: mongoose.Mongoose
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    con = await mongoose.connect(mongoServer.getUri(), {
      dbName: process.env.MONGODB_DATABASE,
    })
  })

  afterEach(async () => {
    const collections = con.connection.collections
    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany()
    }
  })

  afterAll(async () => {
    if (con) {
      await con.connection.close()
    }
    if (mongoServer) {
      await mongoServer.stop()
    }
  })

  const repository = new InboxRepository(notificationModel)

  describe('create', () => {
    it('should save Notification', async () => {
      await expect(repository.create('123', 'Bob')).resolves.not.toThrow()
    })
  })

  describe('findByUserId', () => {
    it('should find all Notifications by user ID', async () => {
      const userId = '123'

      await repository.create(userId, 'Alice')
      await repository.create(userId, 'Alice')

      const results = await repository.findByUserId(userId)

      expect(results).toHaveLength(2)
      expect(results[0].userId).toBe(userId)
      expect(results[1].userId).toBe(userId)
    })
  })
})
