import { randomUUID } from "crypto";
import { UserFact } from "@application/core/facts/user/fact";
import { UserCreatedFactV1 } from "../facts/user/user-created-v1";
import { UserUpdatedFactV1 } from "../facts/user/user-updated-v1";
import { Aggregate } from ".";
import { match } from "@application/library/match"
import { UserConfirmedV1 } from "../facts/user/user-confirmed-v1";

export class UserAggregate implements Aggregate {
  public constructor(
    public readonly identifier: string = "",
    public readonly email: string = "",
    public readonly password: string = "",
    public readonly confirmationToken: string | null = null,
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
            userCreatedFact.data.confirmationToken,
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
            oldUser.confirmationToken,
            oldUser.version + 1
          )
        },
        "user-confirmed-v1": userConfirmedFact => {
          if (!oldUser) {
            return oldUser
          }

          return new UserAggregate(
            oldUser.identifier,
            oldUser.email,
            oldUser.password,
            null,
            oldUser.version + 1,
            oldUser.createdAt,
            userConfirmedFact.data.updatedAt
          )
        }
      })
    }, null as UserAggregate | null)
  }

  public static create(email: string, password: string, confirmationToken: string) {
    const aggregateIdentifier = randomUUID()
    const version = 0

    return new UserCreatedFactV1(version, aggregateIdentifier, {
      email,
      password,
      confirmationToken,
    })
  }

  public confirm() {
    return new UserConfirmedV1(this.version + 1, this.identifier, {
      updatedAt: new Date()
    })
  }

  public isConfirmed() {
    return this.confirmationToken === null
  }

  public update(email?: string) {
    return new UserUpdatedFactV1(this.version + 1, this.identifier, {
      email: email ?? this.email
    })
  }
}