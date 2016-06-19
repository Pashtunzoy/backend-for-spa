import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) next(err);
        user.password = hash;
        return next();
      });
    });
  } else {
    return next();
  }
});


UserSchema.methods.comparePassword = function(pw, cb) {
  bcrypt.compare(pw, this.password, (err, isMatch) => {
    if (err) cb(err);
    cb(null, isMatch);
  });
};

export default mongoose.model('User', UserSchema);
