import { randomUUID } from "crypto";
import { Fact } from "@application/core/facts";

export class UserCreatedFactV1 implements Fact {
  public readonly name = "user-created-v1"
  public readonly aggregate = "user"
  public readonly date = new Date()
  public readonly identifier = randomUUID()

  public constructor(public readonly version: number, public readonly aggregateIdentifier: string, public readonly data: {
    email: string,
    password: string
    confirmed: boolean
  }) { }
}