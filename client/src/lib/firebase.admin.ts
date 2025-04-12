import admin, { ServiceAccount } from "firebase-admin";
import { cert } from "firebase-admin/app";
import { initFirestore } from "@auth/firebase-adapter";

import env from "@/env";

const serviceAccount: ServiceAccount = {
  projectId: env.AUTH_FIREBASE_PROJECT_ID,
  clientEmail: env.AUTH_FIREBASE_CLIENT_EMAIL,
  privateKey: env.AUTH_FIREBASE_PRIVATE_KEY,
};

const firestoreAdminDB = initFirestore({
  credential: cert(serviceAccount),
});

let app;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminFirestoreAuth = admin.auth(app);

export { firestoreAdminDB, adminFirestoreAuth };
