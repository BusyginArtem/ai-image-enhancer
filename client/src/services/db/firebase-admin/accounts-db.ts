// ** Firebase imports
import { adminDb } from "../../firebase/admin";

// ** Types
import {
  Account,
  AccountIdentifier,
  RawAccount,
} from "../../../lib/definitions";
import { AccountsService } from "../../types";

class FirebaseAccountsService implements AccountsService {
  private static instance: FirebaseAccountsService;

  private constructor() {}

  public static getInstance(): FirebaseAccountsService {
    if (!FirebaseAccountsService.instance) {
      FirebaseAccountsService.instance = new FirebaseAccountsService();
    }

    return FirebaseAccountsService.instance;
  }

  public async create({
    newAccount,
  }: {
    newAccount: RawAccount;
  }): Promise<Account["id"] | null> {
    const accountSnapshot = await adminDb
      .collection("accounts")
      .add(newAccount);

    return accountSnapshot.id as AccountIdentifier;
  }

  public async getById({ id }: { id: Account["id"] }): Promise<Account | null> {
    const accountSnapshot = await adminDb.collection("accounts").doc(id).get();

    if (!accountSnapshot.exists) {
      return null;
    }

    const accountData = accountSnapshot.data() as RawAccount;

    return {
      id: accountSnapshot.id as AccountIdentifier,
      ...accountData,
    } as Account;
  }

  public async update({
    id,
    data,
  }: {
    id: Account["id"];
    data: Partial<RawAccount>;
  }): Promise<Account["id"] | null> {
    const accountRef = adminDb.collection("accounts").doc(id);

    if (!(await accountRef.get()).exists) {
      return null;
    }

    await accountRef.update(data);

    return id as AccountIdentifier;
  }
}

export default FirebaseAccountsService.getInstance();
