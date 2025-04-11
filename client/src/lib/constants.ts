export const APP_PATH = {
  ROOT: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
} as const;

export const NAV_ITEMS = [
  {
    label: "Home",
    href: APP_PATH.ROOT,
    target: false,
  },
] as const;
