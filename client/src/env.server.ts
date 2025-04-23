import 'server-only';

interface ServerEnv {
  AUTH_SECRET: string;
  AUTH_FIREBASE_CLIENT_EMAIL: string;
  AUTH_FIREBASE_PRIVATE_KEY: string;
  AUTH_GITHUB_SECRET: string;
  AUTH_GITHUB_ID: string;
  AUTH_FIREBASE_PROJECT_ID: string;
  AUTH_GOOGLE_SECRET: string;
  AUTH_GOOGLE_ID: string;
}

const serverEnv: ServerEnv = {
  AUTH_SECRET: process.env.AUTH_SECRET as string,
  AUTH_FIREBASE_CLIENT_EMAIL: process.env.AUTH_FIREBASE_CLIENT_EMAIL as string,
  AUTH_FIREBASE_PRIVATE_KEY: process.env.AUTH_FIREBASE_PRIVATE_KEY as string,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET as string,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID as string,
  AUTH_FIREBASE_PROJECT_ID: process.env.AUTH_FIREBASE_PROJECT_ID as string,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET as string,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID as string,
};

if (
  !serverEnv.AUTH_SECRET ||
  !serverEnv.AUTH_FIREBASE_CLIENT_EMAIL ||
  !serverEnv.AUTH_FIREBASE_PRIVATE_KEY ||
  !serverEnv.AUTH_GITHUB_SECRET ||
  !serverEnv.AUTH_GITHUB_ID ||
  !serverEnv.AUTH_FIREBASE_PROJECT_ID ||
  !serverEnv.AUTH_GOOGLE_SECRET ||
  !serverEnv.AUTH_GOOGLE_ID
) {
  throw new Error("Missing server-side environment variables");
}

export default serverEnv;
