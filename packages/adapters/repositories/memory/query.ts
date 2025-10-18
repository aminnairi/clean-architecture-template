import { UserAggregate } from "@application/core/aggregates/user"
import { DomainFact } from "@application/core/facts/domain"
import { QueryRepository } from "@application/core/repositories/query"

export class MemoryQueryRepository implements QueryRepository {
  public constructor(private readonly users: UserAggregate[] = []) { }

  public async findUserByIdentifier(identifier: string): Promise<UserAggregate | null> {
    return this.users.find(user => {
      return user.identifier === identifier
    }) ?? null
  }

  public handle(fact: DomainFact): void {
    if (fact.name === "user-created-v1") {
      this.users.push(new UserAggregate(fact.data.identifier, fact.data.email, fact.data.password, fact.data.confirmed, fact.version))
      return
    }

    if (fact.name === "user-updated-v1") {
      const userIndex = this.users.findIndex(user => {
        return user.identifier === fact.data.identifier
      })

      if (!userIndex) {
        return
      }

      this.users.splice(userIndex, 1, new UserAggregate(fact.data.identifier, fact.data.email, this.users[userIndex].password, this.users[userIndex].confirmed, fact.version))
      return
    }
  }

  public async findUserByEmail(email: string): Promise<UserAggregate | null> {
    const user = this.users.find(user => {
      return user.email === email
    })

    return user ?? null
  }
}