import { QueryRepository } from "@application/core/repositories/query";

export class FindUserQuery {
  public constructor(private readonly queryRepository: QueryRepository) { }

  public async execute(identifier: string) {
    const user = await this.queryRepository.findUserByIdentifier(identifier)

    return user
  }
}