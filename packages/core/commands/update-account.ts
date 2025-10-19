import { AccountNotFoundError } from "@application/core/errors/account-not-found";
import { QueryRepository } from "@application/core/repositories/query";
import { UnauthorizedError } from "../errors/unauthorized";
import { PasswordService } from "../services/password";
import { AuthenticationService } from "../services/authentication";
import { FactRepository } from "../repositories/fact";
import { UserAggregate } from "../aggregates/user";

export class UpdateAccountCommand {
  public constructor(
    private readonly factRepository: FactRepository,
    private readonly authenticationService: AuthenticationService,
    private readonly passwordService: PasswordService,
  ) { }

  public async execute(request: { token: string, email: string, password: string }) {
    const userIdentifier = this.authenticationService.parseToken(request.token)
    const userFacts = await this.factRepository.findUserFacts(userIdentifier)
    const user = UserAggregate.fromFacts(userFacts)

    if (!user) {
      return new AccountNotFoundError
    }

    const isValidPassword = await this.passwordService.isValid(request.password, user.password)

    if (!isValidPassword) {
      return new UnauthorizedError
    }

    const updatedUserFact = user.update(request.email)

    return this.factRepository.save(updatedUserFact)
  }
}