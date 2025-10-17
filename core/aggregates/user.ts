import { randomUUID } from "crypto";
import { UserFact } from "@application/core/facts/user/fact";
import { UserCreatedFact } from "@application/core/facts/user/user-created";

export class UserAggregate {
  public constructor(
    public readonly identifier: string = "",
    public readonly email: string = "",
    public readonly password: string = "",
    public readonly confirmed: boolean = false,
  ) { }

  public static fromFacts(events: UserFact[]) {
    return events.reduce((oldUser, event) => {
      if (event.name === "user-created") {
        return new UserAggregate(event.data.identifier, event.data.email, event.data.password, event.data.confirmed)
      }

      return oldUser
    }, null as UserAggregate | null)
  }

  public static create(email: string, password: string) {
    return new UserCreatedFact({
      identifier: randomUUID(),
      email,
      password,
      confirmed: false
    })
  }
}