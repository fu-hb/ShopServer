const Koa = require('koa');
const Router = require('koa-router');
const koaCors = require('koa2-cors');
const koaBody = require('koa-body');
const logger = require('koa-logger');
const koajwt = require('koa-jwt');
const { jwtSecret } = require('./config');
const user = require('./controllers/user');
const { connect, initSchemas } = require('./mongodb/connect');
const { throwError } = require('./utils');
const app = new Koa();
const router = new Router();

// 输出日志
app.use(logger());
// koajwt对需要限制的资源请求进行验证
app.use(function(ctx, next) {
  // Custom 401 handling if you don't want to expose koa-jwt errors to users
  return next().catch(err => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = '请重新登陆';
    } else {
      throw err;
    }
  });
});
app.use(
  koajwt({ secret: jwtSecret }).unless({
    path: [/^\/login/, /^\/register/, /^\/public/]
  })
);

// post参数JSON化
app.use(koaBody());

// 跨域：8080端口可以访问3000端口
app.use(
  koaCors({
    origin: ['http://localhost:8080'],
    credentials: true
  })
);

// 路由
router.use(user.routes());
app.use(router.routes());
app.use(router.allowedMethods());

// 开启服务
app.listen(3000, () => {
  console.log('服务开启：http:localhost:3000');
});

// 数据库连接
(async () => {
  await connect();
  initSchemas();
})();
