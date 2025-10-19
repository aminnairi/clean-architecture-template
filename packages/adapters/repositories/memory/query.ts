import { UserAggregate } from "@application/core/aggregates/user"
import { DomainFact } from "@application/core/facts/domain"
import { QueryRepository } from "@application/core/repositories/query"
import { match } from "@application/library/match"

export class MemoryQueryRepository implements QueryRepository {
  public constructor(private readonly users: UserAggregate[] = []) { }

  public async findUserByConfirmationToken(confirmationToken: string): Promise<UserAggregate | null> {
    const user = this.users.find(user => {
      return user.confirmationToken === confirmationToken
    })

    return user ?? null
  }

  public async findUserByIdentifier(identifier: string): Promise<UserAggregate | null> {
    return this.users.find(user => {
      return user.identifier === identifier
    }) ?? null
  }

  public handle(fact: DomainFact): void {
    match(fact, {
      "user-confirmed-v1": userConfirmedFact => {
        const userIndex = this.users.findIndex(user => {
          return user.identifier === userConfirmedFact.aggregateIdentifier
        })

        if (userIndex < 0) {
          return
        }

        this.users.splice(userIndex, 1, new UserAggregate(
          userConfirmedFact.aggregateIdentifier,
          this.users[userIndex].email,
          this.users[userIndex].password,
          null,
          userConfirmedFact.version,
          this.users[userIndex].createdAt,
          userConfirmedFact.data.updatedAt
        ))
      },
      "user-created-v1": userCreatedFact => {
        this.users.push(new UserAggregate(
          userCreatedFact.aggregateIdentifier,
          userCreatedFact.data.email,
          userCreatedFact.data.password,
          userCreatedFact.data.confirmationToken,
          userCreatedFact.version
        ))
      },
      "user-updated-v1": userUpdatedFact => {

        const userIndex = this.users.findIndex(user => {
          return user.identifier === fact.aggregateIdentifier
        })

        if (userIndex < 0) {
          return
        }

        this.users.splice(userIndex, 1, new UserAggregate(
          userUpdatedFact.aggregateIdentifier,
          userUpdatedFact.data.email,
          this.users[userIndex].password,
          this.users[userIndex].confirmationToken,
          userUpdatedFact.version
        ))
      }
    })
  }

  public async findUserByEmail(email: string): Promise<UserAggregate | null> {
    const user = this.users.find(user => {
      return user.email === email
    })

    return user ?? null
  }
}