import { Account, RawAccount, RawUser, User } from "@/lib/definitions";

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

export interface Service {
  getUserByEmail: ({ email }: { email: string }) => Promise<User | null>;
  createUser: ({ newUser }: { newUser: RawUser }) => Promise<User["id"] | null>;
  createAccount: ({
    newAccount,
  }: {
    newAccount: RawAccount;
  }) => Promise<Account["id"] | null>;
}
