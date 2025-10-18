import { NotificationService } from "@application/core/services/notification";

export class ConsoleNotificationService implements NotificationService {
  public async notifyRegistrationSucceeded(): Promise<void> {
    console.log("[NOTIFICATION] Welcome on board!")
  }
}