import { NotificationService } from "@application/core/services/notification";

export class ConsoleNotificationService implements NotificationService {
  public async notifyRegistrationSucceeded(confirmationToken: string): Promise<void> {
    console.log("[NOTIFICATION] Welcome on board! Your confirmation token is:")
    console.log(confirmationToken)
  }
}
