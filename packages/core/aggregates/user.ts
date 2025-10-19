import { randomUUID } from "crypto";
import { UserFact } from "@application/core/facts/user/fact";
import { UserCreatedFactV1 } from "../facts/user/user-created-v1";
import { UserUpdatedFactV1 } from "../facts/user/user-updated-v1";
import { Aggregate } from ".";
import { match } from "@application/library/match"

export class UserAggregate implements Aggregate {
  public constructor(
    public readonly identifier: string = "",
    public readonly email: string = "",
    public readonly password: string = "",
    public readonly confirmed: boolean = false,
    public readonly version = 0,
    public readonly createdAt = new Date(),
    public readonly updatedAt = new Date()
  ) { }

  public static fromFacts(facts: UserFact[]) {
    return facts.reduce((oldUser, fact) => {
      return match(fact, {
        "user-created-v1": userCreatedFact => {
          return new UserAggregate(
            userCreatedFact.aggregateIdentifier,
            userCreatedFact.data.email,
            userCreatedFact.data.password,
            userCreatedFact.data.confirmed
          )
        },
        "user-updated-v1": userUpdatedFact => {
          if (!oldUser) {
            return oldUser
          }

          return new UserAggregate(
            userUpdatedFact.aggregateIdentifier,
            userUpdatedFact.data.email ?? oldUser?.email,
            oldUser.password,
            oldUser.confirmed,
            oldUser.version + 1
          )
        }
      })
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