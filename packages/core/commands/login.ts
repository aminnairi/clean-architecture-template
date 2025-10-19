import { PasswordService } from "@application/core/services/password";
import { QueryRepository } from "@application/core/repositories/query";
import { UnexpectedError } from "@application/core/errors/unexpected-error";
import { AuthenticationService } from "@application/core/services/authentication";
import { UnconfirmedAccountError } from "@application/core/errors/unconfirmed-account";

export class LoginCommand {
  public constructor(
    private readonly queryRepository: QueryRepository,
    private readonly passwordService: PasswordService,
    private readonly authenticationService: AuthenticationService,
  ) { }

  public async execute(email: string, password: string) {
    const user = await this.queryRepository.findUserByEmail(email)

    if (!user) {
      return new UnexpectedError
    }

    if (!user.confirmed) {
      return new UnconfirmedAccountError
    }

    const isValidPassword = await this.passwordService.isValid(password, user.password)

    if (!isValidPassword) {
      return new UnexpectedError
    }

    const token = this.authenticationService.createToken(user.identifier)

    return token
  }
}