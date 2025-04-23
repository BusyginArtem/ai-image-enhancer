import { FirestoreAdapter } from "@auth/firebase-adapter";
import { adminDb } from "./firebase/admin";

export default FirestoreAdapter(adminDb);
