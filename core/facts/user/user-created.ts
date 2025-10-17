import { randomUUID } from "crypto";
import { Fact } from "@application/core/facts";

export class UserCreatedFact implements Fact {
  public readonly name = "user-created"
  public readonly aggregate = "user"
  public readonly date = new Date()
  public readonly identifier = randomUUID()
  public readonly version = 1

  public constructor(public readonly data: {
    identifier: string,
    email: string,
    password: string
    confirmed: boolean
  }) { }
}