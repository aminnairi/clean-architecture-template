import { UserAggregate } from "../../../../core/aggregates/user"
import { DomainFact } from "../../../../core/facts/domain"
import { QueryRepository } from "../../../../core/repositories/query"

export class MemoryQueryRepository implements QueryRepository {
  public constructor(private readonly users: UserAggregate[] = []) { }

  public async findUserByIdentifier(identifier: string): Promise<UserAggregate | null> {
    return this.users.find(user => {
      return user.identifier === identifier
    }) ?? null
  }

  public handle(fact: DomainFact): void {
    this.users.push(new UserAggregate(fact.data.identifier, fact.data.email, fact.data.password, fact.data.confirmed))
  }
}