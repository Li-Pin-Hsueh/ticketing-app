import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// promisify can convert callbacke-based funciton to asyn-await pattern

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(storedPWD: string, suppliedPWD: string) {
    const [hashedPWD, salt] = storedPWD.split(".");

    const buf = (await scryptAsync(suppliedPWD, salt, 64)) as Buffer;

    return buf.toString("hex") === hashedPWD;
  }
}
