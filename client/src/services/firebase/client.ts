import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";

import env from "@/env";

type Config = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  // measurementId: string;
};

type OverrideConfig = Partial<Config> | null;

const firebaseConfig: Config = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export default (overrideConfig: OverrideConfig = null): FirebaseApp => {
  if (getApps().length && overrideConfig) {
    return initializeApp({
      ...firebaseConfig,
      ...overrideConfig,
    });
  }

  if (!getApps().length && firebaseConfig.apiKey) {
    return initializeApp(firebaseConfig);
  }

  return getApp();
};
