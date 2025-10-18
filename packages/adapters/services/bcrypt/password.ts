import bcrypt from "bcryptjs"
import { PasswordService } from "@application/core/services/password";

export class BcryptPasswordService implements PasswordService {
  public hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 10)
  }

  public isValid(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}