// ** Types
import type { RawUser, User } from "../../lib/definitions";
import type { UsersService } from "../types";

interface IDbUserAdapter {
  getByEmail: ({ email }: { email: string }) => Promise<User | null>;
  create: ({ newUser }: { newUser: RawUser }) => Promise<User["id"] | null>;
  dbService: UsersService;
}

class DbUsersAdapter implements IDbUserAdapter {
  public dbService: UsersService;

  constructor(dbService: UsersService) {
    this.dbService = dbService;
  }

  async getByEmail({ email }: { email: string }): Promise<User | null> {
    if (this.dbService.getByEmail) {
      return await this.dbService.getByEmail({ email });
    }

    return null;
  }

  async create({
    newUser,
  }: {
    newUser: RawUser;
  }): Promise<User["id"] | null> {
    if (this.dbService.create) {
      return await this.dbService.create({ newUser });
    }

    return null;
  }
}

export default DbUsersAdapter;
