// ** Types
import type { Account, RawAccount } from "../../lib/definitions";
import type { AccountsService } from "../types";

interface IDbAccountAdapter {
  create: ({
    newAccount,
  }: {
    newAccount: RawAccount;
  }) => Promise<Account["id"] | null>;
  update: ({
    id,
    data,
  }: {
    id: Account["id"];
    data: Partial<RawAccount>;
  }) => Promise<Account["id"] | null>;
  getById: ({ id }: { id: Account["id"] }) => Promise<Account | null>;
  dbService: AccountsService;
}

class DbAccountsAdapter implements IDbAccountAdapter {
  public dbService: AccountsService;

  constructor(dbService: AccountsService) {
    this.dbService = dbService;
  }

  async create({
    newAccount,
  }: {
    newAccount: RawAccount;
  }): Promise<Account["id"] | null> {
    if (this.dbService.create) {
      return await this.dbService.create({ newAccount });
    }

    return null;
  }

  async update({
    id,
    data,
  }: {
    id: Account["id"];
    data: Partial<RawAccount>;
  }): Promise<Account["id"] | null> {
    if (this.dbService.update) {
      return await this.dbService.update({ id, data });
    }

    return null;
  }

  async getById({ id }: { id: Account["id"] }): Promise<Account | null> {
    if (this.dbService.getById) {
      return await this.dbService.getById({ id });
    }

    return null;
  }
}

export default DbAccountsAdapter;
