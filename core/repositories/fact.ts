import { DomainFact } from "@application/core/facts/domain";
import { QueryRepository } from "@application/core/repositories/query";
import { UserFact } from "@application/core/facts/user/fact";
import { ConcurrencyError } from "@application/core/errors/concurrency";

export type Handler = (fact: DomainFact) => void

export interface FactRepository {
  findUserFacts(userIdentifier: string): Promise<UserFact[]>
  save(fact: DomainFact): Promise<ConcurrencyError | null>
  register(query: QueryRepository): void
}