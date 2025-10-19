import { UserAggregate } from "../aggregates/user";

export interface FindUserResponse {
  user: UserAggregate | null
}