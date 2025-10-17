import { NotificationService } from "@application/core/services/notification";

export class ConsoleNotificationService implements NotificationService {
  public notifyRegistrationSucceeded(): void {
    console.log("[NOTIFICATION] Welcome on board!")
  }
}