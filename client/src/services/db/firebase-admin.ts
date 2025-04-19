// ** Firebase imports

// ** Hooks

// ** Types
import { adminDb } from "../firebase/admin";
import { AuthUser, Service } from "../types";


class FirebaseAdminService implements Service {
  private static instance: FirebaseAdminService;
  // private db = useFirebaseFirestore()

  private constructor() {}

  public static getInstance(): FirebaseAdminService {
    if (!FirebaseAdminService.instance) {
      FirebaseAdminService.instance = new FirebaseAdminService();
    }

    return FirebaseAdminService.instance;
  }

  public async getUserByEmail({
    email,
  }: {
    email: string;
  }): Promise<AuthUser | null> {
    const userSnapshot = await adminDb
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return null;
    }

    const user = userSnapshot.docs[0].data();

    return {
      id: user.id,
      email: user.email,
    };
  }
}

export default FirebaseAdminService.getInstance();
