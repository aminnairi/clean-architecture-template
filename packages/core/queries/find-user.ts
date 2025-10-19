import { QueryRepository } from "@application/core/repositories/query";
import { Query } from ".";
import { FindUserRequest } from "@application/core/request/find-user";
import { FindUserResponse } from "@application/core/response/find-user";

export class FindUserQuery implements Query<FindUserRequest, FindUserResponse> {
  public constructor(private readonly queryRepository: QueryRepository) { }

  public async fetch(request: FindUserRequest): Promise<FindUserResponse> {
    const user = await this.queryRepository.findUserByIdentifier(request.identifier)

    return {
      user
    }
  }
}