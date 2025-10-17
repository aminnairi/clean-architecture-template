import { FindUserQuery } from "@application/core/queries/find-user";
import { RegisterCommand } from "@application/core/commands/register";
import { MemoryQueryRepository } from "@application/adapters/repositories/memory/query";
import { MemoryFactRepository } from "@application/adapters/repositories/memory/fact";
import { ConsoleNotificationService } from "@application/adapters/services/console/notification";

const queryRepository = new MemoryQueryRepository()
const eventRepository = new MemoryFactRepository()
const notificationService = new ConsoleNotificationService()

eventRepository.register(queryRepository)

const registerCommand = new RegisterCommand(eventRepository, notificationService)
const findUserQuery = new FindUserQuery(queryRepository)
const createdUserIdentifier = await registerCommand.execute("user@domain.com", "Password")
const user = await findUserQuery.execute(createdUserIdentifier)

console.log(user)