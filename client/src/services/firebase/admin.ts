import 'server-only';

import { initFirestore } from "@auth/firebase-adapter";
import admin, { ServiceAccount } from "firebase-admin";
import { cert } from "firebase-admin/app";

import env from "@/env.server";

const serviceAccount: ServiceAccount = {
  projectId: env.AUTH_FIREBASE_PROJECT_ID,
  clientEmail: env.AUTH_FIREBASE_CLIENT_EMAIL,
  privateKey: env.AUTH_FIREBASE_PRIVATE_KEY,
};

const adminDb = initFirestore({
  credential: cert(serviceAccount),
});

let app;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminAuth = admin.auth(app);

export { adminAuth, adminDb };

