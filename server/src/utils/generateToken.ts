import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

/**
 * Generates a signed JWT token for the given user ID.
 * @param id - MongoDB ObjectId of the user
 * @returns Signed JWT string
 */
const generateToken = (id: mongoose.Types.ObjectId): string => {
  const secret = process.env.JWT_SECRET as string;
  const expire = (process.env.JWT_EXPIRE as string) || '7d';

  return jwt.sign({ id: id.toString() }, secret, {
    expiresIn: expire,
  } as jwt.SignOptions);
};

export default generateToken;
