// ** Firebase imports
import { adminDb } from "../firebase/admin";

// ** Types
import {
  Account,
  AccountIdentifier,
  RawAccount,
  RawUser,
  User,
  UserIdentifier,
} from "../../lib/definitions";
import { Service } from "../types";

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
  }): Promise<User | null> {
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
      name: user.name,
      image: user.image,
      credits: user.credits,
      usedCredits: user.usedCredits,
      subscription: user.subscription,
    };
  }

  public async createUser({
    newUser,
  }: {
    newUser: RawUser;
  }): Promise<User["id"] | null> {
    const userSnapshot = await adminDb.collection("users").add(newUser);

    return userSnapshot.id as UserIdentifier;
  }

  public async createAccount({
    newAccount,
  }: {
    newAccount: RawAccount;
  }): Promise<Account["id"] | null> {
    const accountSnapshot = await adminDb
      .collection("accounts")
      .add(newAccount);

    return accountSnapshot.id as AccountIdentifier;
  }
}

export default FirebaseAdminService.getInstance();
