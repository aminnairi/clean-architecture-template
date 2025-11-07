import { RegisterCommand } from "@application/core/commands/register";
import { MemoryQueryRepository } from "@application/adapters/repositories/memory/query";
import { MemoryFactRepository } from "@application/adapters/repositories/memory/fact";
import { ConsoleNotificationService } from "@application/adapters/services/console/notification";
import { BcryptPasswordService } from "@application/adapters/services/bcrypt/password"
import { LoginCommand } from "@application/core/commands/login";
import { JsonwebtokenAuthenticationService } from "@application/adapters/services/jsonwebtoken/authentication"
import { UpdateAccountCommand } from "@application/core/commands/update-account";
import { ConfirmCommand } from "@application/core/commands/confirm";
import { input, password, select } from "@inquirer/prompts";
import { exhaustive } from "exhaustive";

enum Menu {
  Quit = "QUIT",
  Register = "REGISTER",
  Confirm = "CONFIRM",
  Login = "LOGIN",
  UpdateProfile = "UPDATE_PROFILE"
}

if (!("JSONWEBTOKEN_SECRET" in process.env)) {
  throw new Error("JSONWEBTOKEN_SECRET environment variable not found")
}

const queryRepository = new MemoryQueryRepository()
const factRepository = new MemoryFactRepository()
const notificationService = new ConsoleNotificationService()
const passwordService = new BcryptPasswordService()
const authenticationService = new JsonwebtokenAuthenticationService(String(process.env.JSONWEBTOKEN_SECRET))

const state = {
  token: ""
}

async function main() {
  const choice = await select({
    message: "Choose an option",
    choices: [
      {
        name: "Quit",
        value: Menu.Quit,
        description: "Quit this program"
      },
      {
        name: "Register",
        value: Menu.Register,
        description: "Register in order to login to this app"
      },
      {
        name: "Confirm",
        value: Menu.Confirm,
        description: "Confirm your registration before login"
      },
      {
        name: "Login",
        value: Menu.Login,
        description: "Login in order to use all features from this app"
      },
      {
        name: "Update Profile",
        value: Menu.UpdateProfile,
        description: "Update your profile informations"
      }
    ]
  })

  factRepository.register(queryRepository)

  await exhaustive(choice, {
    QUIT: async () => {
      console.log("Ok thanks bye.")
    },
    LOGIN: async () => {
      const loginCommand = new LoginCommand(queryRepository, passwordService, authenticationService)

      const email = await input({
        message: "Email",
        required: true
      })

      const pass = await password({
        message: "Password",
      })

      const token = await loginCommand.execute(email, pass)

      if (token instanceof Error) {
        exhaustive(token.name, {
          UnauthorizedError: () => {
            console.error("Invalid credentials")
          },
          UnconfirmedAccountError: () => {
            console.error("Please confirm your account first before attempting to login again.")
          }
        })

        return await main()
      }

      state.token = token

      return await main()
    },
    CONFIRM: async () => {
      const confirmCommand = new ConfirmCommand(queryRepository, factRepository)

      const confirmationToken = await input({
        message: "Confirmation token",
        required: true
      })

      const confirmResponse = await confirmCommand.execute(confirmationToken)

      if (confirmResponse instanceof Error) {
        exhaustive(confirmResponse.name, {
          ConcurrencyError: () => {
            console.error("Account already confirmed.")
          },
          ConfirmationTokenError: () => {
            console.error("Unexpected error, please try again later.")
          },
          AlreadyConfirmedError: () => {
            console.error("Bad confirmation token, please check your token.")
          }
        })
      }

      return await main()
    },
    REGISTER: async () => {
      const registerCommand = new RegisterCommand(factRepository, passwordService, notificationService)

      const email = await input({
        message: "Email",
        required: true
      })

      const pass = await password({
        message: "Password",
      })

      const user = await registerCommand.execute({
        email,
        password: pass
      })

      if (user instanceof Error) {
        exhaustive(user.name, {
          ConcurrencyError: () => {
            console.error("Error while trying to register")
          }
        })
      }

      return await main()
    },
    UPDATE_PROFILE: async () => {
      const updateProfileCommand = new UpdateAccountCommand(factRepository, authenticationService, passwordService)

      const email = await input({
        message: "Email",
        required: true
      })

      const pass = await password({
        message: "Password"
      })

      const updateProfileResponse = await updateProfileCommand.execute({
        token: state.token,
        email,
        password: pass
      })

      if (updateProfileResponse instanceof Error) {
        exhaustive(updateProfileResponse.name, {
          AccountNotFoundError: () => {
            console.error("Account not found.")
          },
          ConcurrencyError: () => {
            console.error("Account informations staled.")
          },
          UnauthorizedError: () => {
            console.error("Bad password, please check your input")
          }
        })
      }

      return await main()
    }
  })
}

await main()
