import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

interface ICompanySettings {
  notificationChannelsEnabled: {
    email: boolean
    inbox: boolean
  }
}

interface IUserSettings {
  profile: {
    name: string
  }
  notificationChannelsEnabled: {
    email: boolean
    inbox: boolean
  }
}

export interface IIdentityService {
  getCompanySettings(companyId: string): Promise<ICompanySettings>
  getUserSettings(userId: string): Promise<IUserSettings>
}

// Magic values
const INVALID_COMPANY_ID = '@1000'
const COMPANY_EMAIL_ONLY = '@1001'
const COMPANY_INBOX_ONLY = '@1002'
const INVALID_USER_ID = '@2000'
const USER_EMAIL_ONLY = '@2001'
const USER_INBOX_ONLY = '@2002'

@Injectable()
export class IdentityService implements IIdentityService {
  constructor(private configService: ConfigService) {}

  async getCompanySettings(companyId: string): Promise<ICompanySettings> {
    try {
      // Mock API call
      const settings = await new Promise<ICompanySettings>(
        (resolve, reject) => {
          if (
            this.configService.get<string>('APP_MODE') === 'development' &&
            companyId === INVALID_COMPANY_ID
          ) {
            reject(new NotFoundException())
          }

          resolve({
            notificationChannelsEnabled: {
              email:
                this.configService.get<string>('APP_MODE') === 'development' &&
                companyId === COMPANY_INBOX_ONLY
                  ? false
                  : true,
              inbox:
                this.configService.get<string>('APP_MODE') === 'development' &&
                companyId === COMPANY_EMAIL_ONLY
                  ? false
                  : true,
            },
          })
        },
      )

      return settings
    } catch (e) {
      throw e
    }
  }

  async getUserSettings(userId: string): Promise<IUserSettings> {
    try {
      // Mock API call
      const settings = await new Promise<IUserSettings>((resolve, reject) => {
        if (
          this.configService.get<string>('APP_MODE') === 'development' &&
          userId === INVALID_USER_ID
        ) {
          reject(new NotFoundException())
        }

        resolve({
          profile: {
            name: 'employee', // TODO: refactor to generate name
          },
          notificationChannelsEnabled: {
            email:
              this.configService.get<string>('APP_MODE') === 'development' &&
              userId === USER_INBOX_ONLY
                ? false
                : true,
            inbox:
              this.configService.get<string>('APP_MODE') === 'development' &&
              userId === USER_EMAIL_ONLY
                ? false
                : true,
          },
        })
      }).then((data) => {
        return data
      })

      return settings
    } catch (e) {
      throw e
    }
  }
}
