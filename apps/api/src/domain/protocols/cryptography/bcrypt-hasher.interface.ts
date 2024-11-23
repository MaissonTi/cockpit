export interface IBcryptHasher {
  compare(plain: string, hash: string): Promise<boolean>;
  hash(plain: string): Promise<string>;
}
