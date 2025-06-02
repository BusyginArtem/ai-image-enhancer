// ** Firebase imports
import { adminDb } from "../../firebase/admin";

// ** Types
import { Subscription, SubscriptionIdentifier } from "../../../lib/definitions";
import { SubscriptionNames, SubscriptionsService } from "../../types";

class FirebaseSubscriptionsService implements SubscriptionsService {
  private static instance: FirebaseSubscriptionsService;

  private constructor() {}

  public static getInstance(): FirebaseSubscriptionsService {
    if (!FirebaseSubscriptionsService.instance) {
      FirebaseSubscriptionsService.instance =
        new FirebaseSubscriptionsService();
    }

    return FirebaseSubscriptionsService.instance;
  }

  public async findByName({
    name,
  }: {
    name: SubscriptionNames;
  }): Promise<Subscription["id"] | null> {
    const subscriptionSnapshot = await adminDb
      .collection("subscriptions")
      .where("name", "==", name)
      .get();

    if (subscriptionSnapshot.empty) {
      return null;
    }

    const subscriptionId = subscriptionSnapshot.docs[0].id;

    return subscriptionId as SubscriptionIdentifier;
  }
}

export default FirebaseSubscriptionsService.getInstance();
