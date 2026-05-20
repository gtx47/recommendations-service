export interface TokenServicePort {
  verify(token: string): Promise<{ userId: string; email: string }>;
}
