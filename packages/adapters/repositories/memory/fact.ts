import { ConcurrencyError } from "@application/core/errors/concurrency"
import { DomainFact } from "@application/core/facts/domain"
import { UserFact } from "@application/core/facts/user/fact"
import { FactRepository } from "@application/core/repositories/fact"
import { QueryRepository } from "@application/core/repositories/query"

export class MemoryFactRepository implements FactRepository {
  public constructor(private readonly facts: Map<string, DomainFact> = new Map(), private readonly queries: QueryRepository[] = []) { }

  public async findUserFacts(userIdentifier: string): Promise<UserFact[]> {
    return Array.from(this.facts.values()).filter(fact => {
      return fact.aggregate === "user" && fact.aggregateIdentifier === userIdentifier
    })
  }

  public async save(fact: DomainFact): Promise<ConcurrencyError | null> {
    const key = `${fact.aggregate}-${fact.aggregateIdentifier}-${fact.revision}`

    if (this.facts.has(key)) {
      return new ConcurrencyError
    }

    this.facts.set(key, fact)

    this.queries.forEach(query => {
      query.handle(fact)
    })

    return null
  }

  public register(query: QueryRepository): void {
    this.queries.push(query)
  }
}
