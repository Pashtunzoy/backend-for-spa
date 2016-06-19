import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../app/models/user';
import config from '../config/main';

const JwtStrategy = Strategy;

const jwtStrategy = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({id: jwt_payload.id}, (err, user) => {
      if(err) done(err, false);
      if(!user) done(null, false);
      done(null, user);
    });
  }));
};


export default jwtStrategy;
