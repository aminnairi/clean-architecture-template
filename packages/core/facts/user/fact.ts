import { UserUpdatedFactV1 } from "./user-updated-v1";
import { UserConfirmedV1 } from "./user-confirmed-v1";
import { UserCreatedFactV1 } from "./user-created-v1";

export type UserFact =
  | UserCreatedFactV1
  | UserUpdatedFactV1
  | UserConfirmedV1