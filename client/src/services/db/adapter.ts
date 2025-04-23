// ** Types
import type { Account, RawAccount, RawUser, User } from "../../lib/definitions";
import type { Service } from "../types";

interface IDbAdapter {
  getUserByEmail: ({ email }: { email: string }) => Promise<User | null>;
  createUser: ({ newUser }: { newUser: RawUser }) => Promise<User["id"] | null>;
  createAccount: ({
    newAccount,
  }: {
    newAccount: RawAccount;
  }) => Promise<Account["id"] | null>;
  dbService: Service;
}

class DbAdapter implements IDbAdapter {
  public dbService: Service;

  constructor(dbService: Service) {
    this.dbService = dbService;
  }

  async getUserByEmail({ email }: { email: string }): Promise<User | null> {
    if (this.dbService.getUserByEmail) {
      return await this.dbService.getUserByEmail({ email });
    }

    return null;
  }

  async createUser({
    newUser,
  }: {
    newUser: RawUser;
  }): Promise<User["id"] | null> {
    if (this.dbService.createUser) {
      return await this.dbService.createUser({ newUser });
    }

    return null;
  }

  async createAccount({
    newAccount,
  }: {
    newAccount: RawAccount;
  }): Promise<Account["id"] | null> {
    if (this.dbService.createAccount) {
      return await this.dbService.createAccount({ newAccount });
    }

    return null;
  }
}

export default DbAdapter;
