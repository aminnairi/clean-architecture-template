import { FindUserQuery } from "@application/core/queries/find-user";
import { RegisterCommand } from "@application/core/commands/register";
import { MemoryQueryRepository } from "@application/adapters/repositories/memory/query";
import { MemoryFactRepository as factRepository, MemoryFactRepository } from "@application/adapters/repositories/memory/fact";
import { ConsoleNotificationService } from "@application/adapters/services/console/notification";
import { BcryptPasswordService } from "@application/adapters/services/bcrypt/password"
import { LoginCommand } from "@application/core/commands/login";
import { JsonwebtokenAuthenticationService } from "@application/adapters/services/jsonwebtoken/authentication"
import { UpdateAccountCommand } from "@application/core/commands/update-account";

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

  const createdUserIdentifier = await registerCommand.execute({ email: "user@domain.com", password: "Password" })

  // Login
  const loginCommand = new LoginCommand(queryRepository, passwordService, authenticationService)

  const token = await loginCommand.execute("user@domain.com", "Password")

  if (token instanceof Error) {
    console.error("Error while login attempt.")
    return
  }

  // Profile update
  const updateProfileCommand = new UpdateAccountCommand(factRepository, authenticationService, passwordService)

  const updateProfileResponse = await updateProfileCommand.execute({
    token,
    email: "other@domain.com",
    password: "Password"
  })

  if (updateProfileResponse instanceof Error) {
    console.error("Unable to update profile.")
    return
  }

  // User display for debug only
  const findUserQuery = new FindUserQuery(queryRepository)

  if (createdUserIdentifier instanceof Error) {
    console.error("Unable to find user")
    return
  }

  const findUserResponse = await findUserQuery.fetch({ identifier: createdUserIdentifier })

  console.log(findUserResponse.user)
}

await main()