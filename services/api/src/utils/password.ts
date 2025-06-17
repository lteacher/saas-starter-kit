import type { Result } from '@saas-starter/utils';
import { success, error } from '@saas-starter/utils';

// Hash password using Bun's built-in Argon2id implementation
export const hashPassword = async (password: string): Promise<Result<string>> => {
  try {
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: 'argon2id',
      memoryCost: 4096,
      timeCost: 3,
    });
    return success(hashedPassword);
  } catch (err) {
    return error(err as Error);
  }
};

// Verify password using Bun's built-in verification
export const verifyPassword = async (password: string, hashedPassword: string): Promise<Result<boolean>> => {
  try {
    const isValid = await Bun.password.verify(password, hashedPassword);
    return success(isValid);
  } catch (err) {
    return error(err as Error);
  }
};