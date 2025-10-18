import { ConcurrencyError } from "@application/core/errors/concurrency"
import { DomainFact } from "@application/core/facts/domain"
import { UserFact } from "@application/core/facts/user/fact"
import { FactRepository } from "@application/core/repositories/fact"
import { QueryRepository } from "@application/core/repositories/query"

export class MemoryFactRepository implements FactRepository {
  public constructor(private readonly facts: Map<{ aggregate: DomainFact["aggregate"], identifier: string, version: number }, DomainFact> = new Map(), private readonly queries: QueryRepository[] = []) { }

  public async findUserFacts(userIdentifier: string): Promise<UserFact[]> {
    return Array.from(this.facts.values()).filter(fact => {
      return fact.data.identifier === userIdentifier
    })
  }

  public async save(fact: DomainFact): Promise<ConcurrencyError | null> {
    if (this.facts.has({ aggregate: fact.aggregate, identifier: fact.data.identifier, version: fact.version })) {
      return new ConcurrencyError
    }

    this.facts.set({ aggregate: fact.aggregate, identifier: fact.data.identifier, version: fact.version }, fact)

    this.queries.forEach(query => {
      query.handle(fact)
    })

    return null
  }

  public register(query: QueryRepository): void {
    this.queries.push(query)
  }
}