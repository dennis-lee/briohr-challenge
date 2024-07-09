import { Injectable } from '@nestjs/common'

export interface IEmailService {
  sendPayslipEmail(userId: string): void
  sendBirthdayEmail(userId: string): void
}

@Injectable()
export class EmailService implements IEmailService {
  sendPayslipEmail(userId: string): void {
    console.log(`Sending payslip email to user: ${userId}`)
  }

  sendBirthdayEmail(userId: string): void {
    console.log(`Sending birthday email to user: ${userId}`)
  }
}
