import jwt from 'jsonwebtoken';

export const generateToken = (id: string, isAdmin: boolean) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};
