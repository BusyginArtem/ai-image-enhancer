// ** Types
import type { Subscription } from "../../lib/definitions";
import type { SubscriptionNames, SubscriptionsService } from "../types";

interface IDbSubscriptionsAdapter {
  findByName: ({
    name,
  }: {
    name: SubscriptionNames;
  }) => Promise<Subscription["id"] | null>;
  dbService: SubscriptionsService;
}

class DbSubscriptionsAdapter implements IDbSubscriptionsAdapter {
  public dbService: SubscriptionsService;

  constructor(dbService: SubscriptionsService) {
    this.dbService = dbService;
  }

  async findByName({
    name,
  }: {
    name: SubscriptionNames;
  }): Promise<Subscription["id"] | null> {
    if (this.dbService.findByName) {
      return await this.dbService.findByName({ name });
    }

    return null;
  }
}

export default DbSubscriptionsAdapter;
