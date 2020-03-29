# 项目介绍

node + koa2 + koa-router + mongoose

## 注意事项（全是坑）

- 为什么使用 koa-body？
  测试发现在使用 XMLHttpRequest2 发送的 FormData 数据时，koa 服务中除 koa-body 外，busboy、body-parse、multer、formidable、multiparty，均无法正确获取。
