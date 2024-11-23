export interface IJwtEncrypter {
  encrypt(payload: Record<string, unknown>): Promise<string>;
}
