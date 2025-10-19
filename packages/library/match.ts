import { Fact } from "@application/core/facts";

export function match<GenericFact extends Fact, Output>(fact: GenericFact, options: { [FactName in GenericFact["name"]]: (fact: Extract<GenericFact, { name: FactName }>) => Output }): Output {
  return options[fact.name as GenericFact["name"]](fact as Extract<GenericFact, { name: GenericFact["name"] }>)
}