import admin, { ServiceAccount } from "firebase-admin";
import { cert } from "firebase-admin/app";
import { initFirestore } from "@auth/firebase-adapter";

import env from "@/env";

const serviceAccount: ServiceAccount = {
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: env.AUTH_FIREBASE_CLIENT_EMAIL,
  privateKey: env.AUTH_FIREBASE_PRIVATE_KEY,
};

// const databaseURL = "https://ai-enhancer-tool.firebaseio.com";
const databaseURL = "https://ai-enhancer-tool-default-rtdb.europe-west1.firebasedatabase.app/";

export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL,
    });
  }

  return admin;
}

const firebaseAdmin = getFirebaseAdmin();
const db = firebaseAdmin.firestore();
const firestore = initFirestore({
  credential: cert({
    projectId: env.AUTH_FIREBASE_PROJECT_ID,
    clientEmail: env.AUTH_FIREBASE_CLIENT_EMAIL,
    privateKey: env.AUTH_FIREBASE_PRIVATE_KEY,
  }),
});

export { firestore, db };
