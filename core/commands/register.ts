import { UserAggregate } from "@application/core/aggregates/user";
import { FactRepository } from "@application/core/repositories/fact";
import { NotificationService } from "@application/core/services/notification";
import { PasswordService } from "../services/password";

export class RegisterCommand {
  public constructor(
    private readonly eventRepository: FactRepository,
    private readonly passwordService: PasswordService,
    private readonly notificationService: NotificationService
  ) { }

  public async execute(request: { email: string, password: string }) {
    const version = 0
    const password = await this.passwordService.hash(request.password)
    const user = UserAggregate.create(version, request.email, password)

    const error = await this.eventRepository.save(user)

    if (error) {
      return error
    }

    await this.notificationService.notifyRegistrationSucceeded()

    return user.aggregateIdentifier
  }
}