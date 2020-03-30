const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
// 用户模型
const UserSchema = new Schema({
  username: {
    required: true,
    unique: true,
    type: String
  },
  password: {
    required: true,
    type: String,
    minlength: 6,
    maxlength: 16
  },
  createDate: {
    type: Date,
    default: Date.now()
  }
}, {
  collection: 'User'
});

// 加盐处理,注意this的指向
UserSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) next(err);
    this.password = hash;
    next();
  });
});

UserSchema.methods.passwordCompare = (password, saltPassword) => {
  return bcrypt.compareSync(password, saltPassword);
};
// 发布模型
mongoose.model('User', UserSchema);