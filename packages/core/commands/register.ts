import { UserAggregate } from "@application/core/aggregates/user";
import { FactRepository } from "@application/core/repositories/fact";
import { NotificationService } from "@application/core/services/notification";
import { PasswordService } from "../services/password";
import { createHash } from "crypto"

export class RegisterCommand {
  public constructor(
    private readonly eventRepository: FactRepository,
    private readonly passwordService: PasswordService,
    private readonly notificationService: NotificationService
  ) { }

  public async execute(request: { email: string, password: string }) {
    const password = await this.passwordService.hash(request.password)
    const confirmationToken = createHash("sha256").digest("base64")
    const user = UserAggregate.create(request.email, password, confirmationToken)

    const error = await this.eventRepository.save(user)

    if (error) {
      return error
    }

    await this.notificationService.notifyRegistrationSucceeded(confirmationToken)

    return {
      identifier: user.aggregateIdentifier,
      confirmationToken
    }
  }
}
