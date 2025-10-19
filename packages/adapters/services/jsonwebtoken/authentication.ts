import { AuthenticationService } from "@application/core/services/authentication";
import jsonwebtoken from "jsonwebtoken"

export class JsonwebtokenAuthenticationService implements AuthenticationService {
  public constructor(private readonly secret: string) { }

  public createToken(userIdentifier: string): string {
    return jsonwebtoken.sign(userIdentifier, this.secret)
  }

  public parseToken(token: string): string {
    return String(jsonwebtoken.verify(token, this.secret))
  }
}