const Router = require('koa-router');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const router = new Router();

// 注册
router.post('/register', async ctx => {
  const User = mongoose.model('User');
  const bodyData = ctx.request.body;
  const user = new User(bodyData);
  let isExist = false;

  await User.findOne({ username: bodyData.username }).then(data => {
    if (data) isExist = true;
  });

  if (isExist) {
    ctx.body = {
      success: false,
      message: '该账号已经存在'
    };
  } else {
    await user
      .save()
      .then(data => {
        ctx.body = {
          success: true,
          message: '注册成功'
        };
      })
      .catch(err => {
        ctx.body = {
          success: false,
          message: err
        };
      });
  }
});

// 登录
router.post('/login', async ctx => {
  const User = mongoose.model('User');
  const bodyData = ctx.request.body;
  let currentUser;
  await User.findOne({ username: bodyData.username }).then(data => {
    if (data) currentUser = data;
  });
  if (currentUser) {
    const user = new User();
    const isEqual = user.passwordCompare(
      bodyData.password,
      currentUser.password
    );
    if (isEqual) {
      const token = jwt.sign(
        {
          data: bodyData
        },
        jwtSecret,
        { expiresIn: '72h' }
      );
      ctx.body = {
        success: true,
        token: token
      };
    } else {
      ctx.body = {
        success: false,
        token: '密码错误'
      };
    }
  } else {
    ctx.body = {
      success: false,
      message: '账号不存在'
    };
  }
});

// 获取所有用户
router.get('/api/allUsers', async ctx => {
  const User = mongoose.model('User');
  await User.find({}).then(data => {
    if (data) {
      ctx.body = {
        success: true,
        message: '操作成功',
        data
      };
    }
  });
});

module.exports = router;
