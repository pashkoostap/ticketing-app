import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHex(value: string, salt: string): Promise<string> {
    const buffer = (await scryptAsync(value, salt, 64)) as Buffer;
    return buffer.toString('hex');
  }

  static async toHash(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const hexed = await this.toHex(password, salt);

    return `${hexed}.${salt}`;
  }

  static async compare(stored: string, supplied: string): Promise<boolean> {
    const [hashed, salt] = stored.split('.');
    const hexed = await this.toHex(supplied, salt);

    return hashed === hexed;
  }
}
