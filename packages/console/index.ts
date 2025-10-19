import { FindUserQuery } from "@application/core/queries/find-user";
import { RegisterCommand } from "@application/core/commands/register";
import { MemoryQueryRepository } from "@application/adapters/repositories/memory/query";
import { MemoryFactRepository } from "@application/adapters/repositories/memory/fact";
import { ConsoleNotificationService } from "@application/adapters/services/console/notification";
import { BcryptPasswordService } from "@application/adapters/services/bcrypt/password"

async function main() {
  const queryRepository = new MemoryQueryRepository()
  const eventRepository = new MemoryFactRepository()
  const notificationService = new ConsoleNotificationService()
  const passwordService = new BcryptPasswordService()

  eventRepository.register(queryRepository)

  const registerCommand = new RegisterCommand(eventRepository, passwordService, notificationService)
  const findUserQuery = new FindUserQuery(queryRepository)
  const createdUserIdentifier = await registerCommand.execute({ email: "user@domain.com", password: "Password" })

  if (createdUserIdentifier instanceof Error) {
    console.error()
    return
  }

  const findUserResponse = await findUserQuery.fetch({ identifier: createdUserIdentifier })

  console.log(findUserResponse.user)
}

await main()