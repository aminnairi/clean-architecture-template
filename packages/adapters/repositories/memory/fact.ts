import { DomainFact } from "@application/core/facts/domain"
import { UserCreatedFact } from "@application/core/facts/user/user-created"
import { FactRepository } from "@application/core/repositories/fact"
import { QueryRepository } from "@application/core/repositories/query"

export class MemoryFactRepository implements FactRepository {
  public constructor(private readonly events: DomainFact[] = [], private readonly queries: QueryRepository[] = []) { }

  public dispatch(fact: DomainFact): void {
    this.queries.forEach(query => {
      query.handle(fact)
    })
  }

  public register(query: QueryRepository): void {
    this.queries.push(query)
  }

  public async save(fact: DomainFact): Promise<void> {
    this.events.push(fact)
  }

  public async findUserEventsByIdentifier(identifier: string): Promise<UserCreatedFact[]> {
    return this.events.filter(fact => {
      return fact.aggregate === "user" && fact.identifier === identifier
    })
  }
}