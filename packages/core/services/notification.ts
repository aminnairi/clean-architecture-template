export interface NotificationService {
  notifyRegistrationSucceeded(confirmationToken: string): Promise<void>
}
