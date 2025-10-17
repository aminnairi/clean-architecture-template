import { DomainFact } from "@application/core/facts/domain";
import { UserFact } from "@application/core/facts/user/fact";
import { QueryRepository } from "@application/core/repositories/query";

export type Handler = (fact: DomainFact) => void

export interface FactRepository {
  findUserEventsByIdentifier(identifier: string): Promise<UserFact[]>
  dispatch(fact: DomainFact): void
  register(query: QueryRepository): void
}