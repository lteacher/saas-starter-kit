// Hash password using Bun's built-in Argon2id implementation
export const hashPassword = async (password: string): Promise<string> => {
  return await Bun.password.hash(password, {
    algorithm: 'argon2id',
    memoryCost: 4096,
    timeCost: 3,
  });
};

// Verify password using Bun's built-in verification
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await Bun.password.verify(password, hashedPassword);
};