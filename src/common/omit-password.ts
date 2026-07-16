import { User } from '@prisma/client';

export function omitPasswordHash(user: User): Omit<User, 'passwordHash'> {
  const { passwordHash, ...safe } = user;
  return safe;
}
