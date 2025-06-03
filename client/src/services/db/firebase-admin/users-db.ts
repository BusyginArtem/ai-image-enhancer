// ** Firebase imports
import { adminDb } from "../../firebase/admin";

// ** Types
import { RawUser, User, UserIdentifier } from "../../../lib/definitions";
import { UsersService } from "../../types";

class FirebaseUserService implements UsersService {
  private static instance: FirebaseUserService;

  private constructor() {}

  public static getInstance(): FirebaseUserService {
    if (!FirebaseUserService.instance) {
      FirebaseUserService.instance = new FirebaseUserService();
    }

    return FirebaseUserService.instance;
  }

  public async getByEmail({ email }: { email: string }): Promise<User | null> {
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
      // subscription: user.subscription,
    };
  }

  public async create({
    newUser,
  }: {
    newUser: RawUser;
  }): Promise<User["id"] | null> {
    const userSnapshot = await adminDb.collection("users").add(newUser);

    return userSnapshot.id as UserIdentifier;
  }
}

export default FirebaseUserService.getInstance();
