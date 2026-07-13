export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = (await import('bcryptjs')).default;
  return bcrypt.hash(password, 10);
};

export const sanitizeUser = <T extends Record<string, unknown>>(user: T) => {
  const { password, ...safeUser } = user;
  return safeUser;
};
