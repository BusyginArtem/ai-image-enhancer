const env = {
  AUTH_SECRET: process.env.AUTH_SECRET as string,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env
    .NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  AUTH_FIREBASE_CLIENT_EMAIL: process.env.AUTH_FIREBASE_CLIENT_EMAIL as string,
  AUTH_FIREBASE_PRIVATE_KEY: process.env.AUTH_FIREBASE_PRIVATE_KEY as string,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET as string,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID as string,
  AUTH_FIREBASE_PROJECT_ID: process.env.AUTH_FIREBASE_PROJECT_ID as string,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET as string,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID as string,
};

if (
  !env.AUTH_SECRET ||
  !env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  !env.AUTH_FIREBASE_PROJECT_ID ||
  !env.AUTH_FIREBASE_CLIENT_EMAIL ||
  !env.AUTH_FIREBASE_PRIVATE_KEY ||
  !env.AUTH_GITHUB_SECRET ||
  !env.AUTH_GITHUB_ID ||
  !env.AUTH_GOOGLE_SECRET ||
  !env.AUTH_GOOGLE_ID
) {
  throw new Error("Missing environment variables");
}

export default env;
