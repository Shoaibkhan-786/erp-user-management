import passport from 'passport';
import db from '../models/index.js';

export const authenticate = passport.authenticate('jwt', { session: false });

export const ensureRole = (requiredRoleName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const role = await db.Role.findByPk(req.user.roleId);
      if (!role) return res.status(403).json({ message: 'Role not found' });
      if (role.name.toLowerCase() !== requiredRoleName.toLowerCase()) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
};
