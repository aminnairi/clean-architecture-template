export interface Fact {
  readonly identifier: string
  readonly aggregate: string
  readonly aggregateIdentifier: string
  readonly name: string
  readonly revision: number
  readonly date: Date
  readonly data: unknown
}
