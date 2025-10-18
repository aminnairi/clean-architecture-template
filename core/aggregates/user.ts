import { randomUUID } from "crypto";
import { UserFact } from "@application/core/facts/user/fact";
import { UserCreatedFactV1 } from "../facts/user/user-created-v1";
import { UserUpdatedFactV1 } from "../facts/user/user-updated-v1";

export class UserAggregate {
  public constructor(
    public readonly identifier: string = "",
    public readonly email: string = "",
    public readonly password: string = "",
    public readonly confirmed: boolean = false,
    public readonly version = 0
  ) { }

  public static fromFacts(facts: UserFact[]) {
    return facts.reduce((oldUser, fact) => {
      if (fact.name === "user-created-v1") {
        return new UserAggregate(fact.aggregateIdentifier, fact.data.email, fact.data.password, fact.data.confirmed)
      }

      if (!oldUser) {
        return oldUser
      }

      if (fact.name === "user-updated-v1") {
        return new UserAggregate(
          fact.aggregateIdentifier,
          fact.data.email ?? oldUser?.email,
          oldUser.password,
          oldUser.confirmed,
          oldUser.version + 1
        )
      }

      return oldUser
    }, null as UserAggregate | null)
  }

  public static create(version: number, email: string, password: string) {
    const aggregateIdentifier = randomUUID()

    return new UserCreatedFactV1(version, aggregateIdentifier, {
      email,
      password,
      confirmed: false
    })
  }

  public update(email?: string) {
    return new UserUpdatedFactV1(this.version, this.identifier, {
      email: email ?? this.email
    })
  }
}