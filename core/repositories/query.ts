import { UserAggregate } from "@application/core/aggregates/user";
import { DomainFact } from "@application/core/facts/domain";

export interface QueryRepository {
  handle(fact: DomainFact): void
  findUserByIdentifier(identifier: string): Promise<UserAggregate | null>
}