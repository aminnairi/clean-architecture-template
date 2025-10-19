import { AlreadyConfirmedError } from "../errors/already-confirmed";
import { ConfirmationTokenError } from "../errors/confirmation-token";
import { FactRepository } from "../repositories/fact";
import { QueryRepository } from "../repositories/query";

export class ConfirmCommand {
  public constructor(
    private readonly queryRepository: QueryRepository,
    private readonly factRepository: FactRepository
  ) { }

  public async execute(confirmationToken: string) {
    const user = await this.queryRepository.findUserByConfirmationToken(confirmationToken)

    if (!user) {
      return new ConfirmationTokenError
    }

    if (user.isConfirmed()) {
      return new AlreadyConfirmedError
    }

    const userConfirmedFact = user.confirm()
    const error = await this.factRepository.save(userConfirmedFact)

    if (error) {
      return error
    }

    return null
  }
}