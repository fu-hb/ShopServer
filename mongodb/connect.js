const mongoose = require('mongoose');
const { dbUrl } = require('../config');
const glob = require('glob');
const path = require('path');

// 自动生成下标
mongoose.set('useCreateIndex', true);

// 模型初始化
exports.initSchemas = () => {
  glob.sync(path.resolve(__dirname, '../model', '*.js')).forEach(require);
};

exports.connect = () => {
  // 连接数据库
  const connectParams = { useNewUrlParser: true };
  mongoose.connect(dbUrl, connectParams);
  // 连接成功
  mongoose.connection.once('open', () => {
    console.log('mongobd连接成功');
  });
  // 连接异常
  mongoose.connection.on('error', err => {
    console.log('链接出错', err);
    mongoose.connect(dbUrl, connectParams);
  });
  // 断开连接
  mongoose.connection.on('disconnected', err => {
    console.log('断开连接', err);
    mongoose.connect(dbUrl, connectParams);
  });
};
