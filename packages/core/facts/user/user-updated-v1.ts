import { Fact } from "@application/core/facts";
import { randomUUID } from "node:crypto"

export class UserUpdatedFactV1 implements Fact {
  public readonly aggregate = "user"
  public readonly identifier = randomUUID();
  public readonly name = "user-updated-v1";
  public readonly date = new Date();

  public constructor(public readonly revision: number, public readonly aggregateIdentifier: string, public readonly data: {
    email: string,
  }) { }
}
