import { Fact } from "..";
import { randomUUID } from "crypto"

export class UserConfirmedV1 implements Fact {
  public readonly identifier = randomUUID()
  public readonly aggregate = "user"
  public readonly name = "user-confirmed-v1"
  public readonly date = new Date()

  public constructor(public readonly revision: number, public readonly aggregateIdentifier: string, public readonly data: {
    updatedAt: Date
  }) { }
}
