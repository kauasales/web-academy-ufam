export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = (await import('bcryptjs')).default;
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const bcrypt = (await import('bcryptjs')).default;
  return bcrypt.compare(password, hashedPassword);
};

export const sanitizeUser = <T extends Record<string, unknown>>(user: T) => {
  const { password, ...safeUser } = user;
  return safeUser;
};
