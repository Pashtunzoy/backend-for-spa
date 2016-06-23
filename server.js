import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
import config from './config/main';
import User from './app/models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import jwtStrategy from './config/passport';


const app = express();
dotenv.config();
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(morgan('dev'));

app.use(passport.initialize());

mongoose.connect(config.database);

jwtStrategy(passport);

const apiRouter = express.Router();

app.all("/api/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  return next();
});

apiRouter.post('/register', (req, res) => {
  if(!req.body.email || !req.body.password) res.json({success: false, message: 'Please enter an emai & password to register'});

  const newUser = new User({
    email: req.body.email,
    password: req.body.password
  });

  newUser.save((err) => {
    if(err) res.json({success: false, message: 'That email address already exists.'});
    res.json({success: true, message: 'Sucessfuly signed up.'})
  });
});


apiRouter.post('/authenticate', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if(err) throw err;
    if(!user) return res.json({sucess: false, message: 'Authentication failed. User not found.'});
    user.comparePassword(req.body.password, (err, isMatch) => {
        if(isMatch && !err) {
          const token = jwt.sign(user.toObject(), config.secret, {
            expiresIn: 86400
          });
          return res.json({success: true, token: `JWT ${token}`})
        }
        res.send({sucess: false, message: 'Authentication failed. Password did not match.'});
    });
  });
});


// This route will require JWT token to get access to.
apiRouter.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).send(`Access Granted & info for the access is: ${req.user.email}`);
});


app.use('/api', apiRouter);


app.get('*', function(req, res) {
  res.json({'Initial Message': 'Welcome to NodeJs User Crud Backend fro SPAs.'});
});

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`http://localhost:${port}`);
});
