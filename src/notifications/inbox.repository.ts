import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Notification } from './schemas/notification.schema'
import { Model } from 'mongoose'

export interface IInboxRepository {
  create(userId: string, content: string): Promise<Notification>
}

@Injectable()
export class InboxRepository implements IInboxRepository {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  create(userId: string, content: string): Promise<Notification> {
    const notification = new this.notificationModel({ userId, content })
    return notification.save()
  }
}
