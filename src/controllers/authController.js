import passport from 'passport';
import { signToken } from '../utils/jwt.js';

/**
 * Login controller
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || 'Invalid credentials' });
    const token = signToken({ userId: user.id, companyId: user.companyId, roleId: user.roleId });
    return res.json({ token });
  })(req, res, next);
};