import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export type NotificationDocument = HydratedDocument<Notification>

@Schema()
export class Notification {
  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  content: string

  @Prop({ default: false })
  isSeen: boolean

  @Prop({ default: dayjs().utc() })
  createdAt: Date
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
