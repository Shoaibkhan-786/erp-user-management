import 'dotenv/config'
import jwt from 'jsonwebtoken';

export function signToken({ userId, companyId, roleId }) {
  const payload = { userId, companyId, roleId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  return token;
}
