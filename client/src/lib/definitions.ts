import { AuthProviderType, AuthType } from "@/services/types";
import { Timestamp } from "firebase-admin/firestore";

declare const __brand__type__: unique symbol;

type Brand<BaseType, BrandName> = BaseType & {
  readonly [__brand__type__]: BrandName;
};

export type UserIdentifier = Brand<string, "USER_IDENTIFIER">;
export type AccountIdentifier = Brand<string, "ACCOUNT_IDENTIFIER">;
export type SubscriptionIdentifier = Brand<string, "SUBSCRIPTION_IDENTIFIER">;
// export type Identifier = Brand<string, "IDENTIFIER">;

export type Pagination = { count?: number; page?: number };

export type AuthFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        password_confirmation?: string[];
      };
      message?: string;
      fields?: Record<string, string>;
      success: boolean;
    }
  | undefined;

type NavLabel = "Home" | "Inpaint";

export type NavItem = {
  label: NavLabel;
  href: string;
  target: boolean;
};

export interface User {
  id: UserIdentifier;
  email: string;
  name: string;
  image: string;
  credits: number;
  usedCredits: number;
  // subscription: string;
  password?: string;
}

export interface RawUser {
  email: string;
  name: null;
  createdAt: Timestamp;
  emailVerified: null;
  image: null;
  password: string;
}

export type AuthUser = Pick<User, "id" | "email">;

export interface Account {
  id: AccountIdentifier;
  credits: number;
  usedCredits: number;
  subscriptionId: SubscriptionIdentifier;
  access_token?: string;
  scope?: string;
  token_type?: string;
  userId: UserIdentifier;
  provider: AuthProviderType;
  type: AuthType;
  providerAccountId: UserIdentifier;
}
export interface RawAccount {
  credits: number;
  usedCredits: number;
  subscriptionId: SubscriptionIdentifier;
  access_token?: string;
  scope?: string;
  token_type?: string;
  userId: UserIdentifier;
  provider: AuthProviderType;
  type: AuthType;
  providerAccountId: UserIdentifier;
}

export interface Subscription {
  id: SubscriptionIdentifier;
  name: string;
  price: number;
}
