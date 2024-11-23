import { IBcryptHasher } from '@/domain/protocols/cryptography/bcrypt-hasher.interface';
import { hash, compare } from 'bcryptjs';

export class BcryptHasher implements IBcryptHasher {
  private HASH_SALT_LENGTH = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
