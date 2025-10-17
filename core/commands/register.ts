import { UserAggregate } from "@application/core/aggregates/user";
import { FactRepository } from "@application/core/repositories/fact";
import { NotificationService } from "@application/core/services/notification";

export class RegisterCommand {
  public constructor(
    private readonly eventRepository: FactRepository,
    private readonly notificationService: NotificationService
  ) { }

  public async execute(email: string, password: string) {
    const user = UserAggregate.create(email, password)

    this.eventRepository.dispatch(user)
    this.notificationService.notifyRegistrationSucceeded()

    return user.data.identifier
  }
}