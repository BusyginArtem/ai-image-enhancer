// ** Types
import type { AuthUser, Service } from '../types'

interface IDbAdapter {
  getUserByEmail: ({ email }: { email: string }) => Promise<AuthUser | null>
  dbService: Service
}

class DbAdapter implements IDbAdapter {
  public dbService: Service

  constructor(dbService: Service) {
    this.dbService = dbService
  }

  async getUserByEmail({ email }: { email: string }): Promise<AuthUser | null> {
    if (this.dbService.getUserByEmail) {
      return await this.dbService.getUserByEmail({ email })
    }

    return null
  }
}

export default DbAdapter
