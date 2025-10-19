import { PasswordService } from "@application/core/services/password";
import { QueryRepository } from "@application/core/repositories/query";
import { AuthenticationService } from "@application/core/services/authentication";
import { UnconfirmedAccountError } from "@application/core/errors/unconfirmed-account";
import { UnauthorizedError } from "../errors/unauthorized";

export class LoginCommand {
  public constructor(
    private readonly queryRepository: QueryRepository,
    private readonly passwordService: PasswordService,
    private readonly authenticationService: AuthenticationService,
  ) { }

  public async execute(email: string, password: string) {
    const user = await this.queryRepository.findUserByEmail(email)

    if (!user) {
      return new UnauthorizedError
    }

    if (!user.isConfirmed()) {
      return new UnconfirmedAccountError
    }

    const isValidPassword = await this.passwordService.isValid(password, user.password)

    if (!isValidPassword) {
      return new UnauthorizedError
    }

    const token = this.authenticationService.createToken(user.identifier)

    return token
  }
}