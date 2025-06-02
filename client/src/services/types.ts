import {
  Account,
  RawAccount,
  RawUser,
  Subscription,
  User,
} from "@/lib/definitions";

export enum AuthProviders {
  CREDENTIALS = "credentials",
  GITHUB = "github",
}
export enum AuthTypes {
  CREDENTIALS = "credentials",
  OAUTH = "oauth",
}

export type AuthProviderType = `${AuthProviders}`; // "credentials" | "github"
export type AuthType = `${AuthTypes}`; // "credentials" | "oauth"

export interface UsersService {
  getByEmail: ({ email }: { email: string }) => Promise<User | null>;
  create: ({ newUser }: { newUser: RawUser }) => Promise<User["id"] | null>;
}
export interface AccountsService {
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
}
export interface SubscriptionsService {
  findByName: ({
    name,
  }: {
    name: SubscriptionNames;
  }) => Promise<Subscription["id"] | null>;
}

export type SubscriptionNames = "FREE" | "PRO" | "ENTERPRISE";
