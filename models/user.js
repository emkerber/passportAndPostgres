var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  username: { type : String, required : true, index : { unique : true } },
  password: { type : String, required : true }
});

UserSchema.pre('save', function(next) {
  var user = this;

  //this only hashes the password if it's new or been modified
  if (!user.isModified('password')) {
    return next();
  }

  //generates a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    //hashes the password and our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) {
        return next(err);
      }

      //overrides the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

//convenience method for comparing passwords later on
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};


module.exports = mongoose.model('User', UserSchema);
