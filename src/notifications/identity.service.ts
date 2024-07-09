import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

interface ICompanySettings {
  notificationChannelsEnabled: {
    email: boolean
    inbox: boolean
  }
}

interface IUserSettings {
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
const INVALID_USER_ID = '@1000'

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
              email: true,
              inbox: true,
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
          notificationChannelsEnabled: {
            email: true,
            inbox: true,
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
