export interface Fact {
  readonly identifier: string
  readonly aggregate: string
  readonly name: string
  readonly version: number
  readonly date: Date
  readonly data: unknown
}