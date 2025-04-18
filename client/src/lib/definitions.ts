declare const __brand__type__: unique symbol;

type Brand<BaseType, BrandName> = BaseType & {
  readonly [__brand__type__]: BrandName;
};

export type Identifier = Brand<string, "IDENTIFIER">;

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

type NavLabel = "Home" | "Wallet" | "Market";

export type NavItem = {
  label: NavLabel;
  href: string;
  target: boolean;
};
