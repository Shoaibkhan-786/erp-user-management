import 'dotenv/config';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import db from '../models/index.js';
import bcrypt from 'bcryptjs';

const { User } = db;

export default function configurePassport() {
  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email, isDeleted: false } });
      if (!user) return done(null, false, { message: 'Invalid credentials' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Invalid credentials' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  }, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.userId);
      if (!user || user.isDeleted) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));

  return passport;
}
