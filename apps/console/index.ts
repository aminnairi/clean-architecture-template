import { FindUserQuery } from "@application/core/queries/find-user";
import { RegisterCommand } from "@application/core/commands/register";
import { MemoryQueryRepository } from "@application/adapters/repositories/memory/query";
import { MemoryFactRepository as factRepository, MemoryFactRepository } from "@application/adapters/repositories/memory/fact";
import { ConsoleNotificationService } from "@application/adapters/services/console/notification";
import { BcryptPasswordService } from "@application/adapters/services/bcrypt/password"
import { LoginCommand } from "@application/core/commands/login";
import { JsonwebtokenAuthenticationService } from "@application/adapters/services/jsonwebtoken/authentication"
import { UpdateAccountCommand } from "@application/core/commands/update-account";
import { ConfirmCommand } from "@application/core/commands/confirm";

async function main() {
  if (!("JSONWEBTOKEN_SECRET" in process.env)) {
    throw new Error("JSONWEBTOKEN_SECRET environment variable not found")
  }

  const queryRepository = new MemoryQueryRepository()
  const factRepository = new MemoryFactRepository()
  const notificationService = new ConsoleNotificationService()
  const passwordService = new BcryptPasswordService()
  const authenticationService = new JsonwebtokenAuthenticationService(String(process.env.JSONWEBTOKEN_SECRET))

  factRepository.register(queryRepository)

  // Registration
  const registerCommand = new RegisterCommand(factRepository, passwordService, notificationService)

  console.log("Registrating...")

  const user = await registerCommand.execute({ email: "user@domain.com", password: "Password" })

  if (user instanceof Error) {
    console.error("Error while trying to register")
    return
  }

  console.log("Registrated.")

  // Confirmation registration
  const confirmCommand = new ConfirmCommand(queryRepository, factRepository)

  console.log("Confirming account...")

  const confirmResponse = await confirmCommand.execute(user.confirmationToken)

  if (confirmResponse instanceof Error) {
    if (confirmResponse.name === "AlreadyConfirmedError") {
      console.error("Account already confirmed.")
      return
    }

    if (confirmResponse.name === "ConcurrencyError") {
      console.error("Unexpected error, please try again later.")
      return
    }

    if (confirmResponse.name === "ConfirmationTokenError") {
      console.error("Bad confirmation token, please check your token.")
      return
    }

    console.error("Error while trying to confirm account.")
    return
  }

  console.log("Account confirmed.")

  // Login
  const loginCommand = new LoginCommand(queryRepository, passwordService, authenticationService)

  console.log("Login...")

  const token = await loginCommand.execute("user@domain.com", "Password")

  if (token instanceof Error) {
    if (token.name === "UnauthorizedError") {
      console.error("Invalid credentials")
      return
    }

    if (token.name === "UnconfirmedAccountError") {
      console.error("Please confirm your account first before attempting to login again.")
      return
    }

    console.error("Error while login attempt.")
    return
  }

  console.log("Successfully logged in.")

  // Profile update
  const updateProfileCommand = new UpdateAccountCommand(factRepository, authenticationService, passwordService)

  console.log("Profile update...")

  const updateProfileResponse = await updateProfileCommand.execute({
    token,
    email: "other@domain.com",
    password: "Password"
  })

  if (updateProfileResponse instanceof Error) {
    if (updateProfileResponse.name === "AccountNotFoundError") {
      console.error("Account not found.")
      return
    }

    if (updateProfileResponse.name === "ConcurrencyError") {
      console.error("Account informations staled.")
      return
    }

    if (updateProfileResponse.name === "UnauthorizedError") {
      console.error("Please, login again before updating your account.")
      return
    }

    console.error("Unable to update profile.")
    return
  }

  console.log("Successfully updated profile.")

  // User display for debug only
  const findUserQuery = new FindUserQuery(queryRepository)

  const findUserResponse = await findUserQuery.fetch({ identifier: user.identifier })

  console.log(findUserResponse.user)
}

await main()