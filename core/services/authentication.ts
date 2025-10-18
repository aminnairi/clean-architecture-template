export interface AuthenticationService {
  createToken(userIdentifier: string): string
  parseToken(token: string): string
}