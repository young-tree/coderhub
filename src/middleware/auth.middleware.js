const jwt = require("jsonwebtoken");

const errorTypes = require("../constants/error-types");
const userService = require("../service/user.service");
const authService = require("../service/auth.service")
const md5password = require("../utils/password-handle");

const { PUBLIC_KEY } = require("../app/config");

const verifyLogin = async (ctx, next) => {
  // 1.获取用户名和密码
  const { name, password } = ctx.request.body;

  // 2.判断用户名和密码是否为空
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit('error', error, ctx);
  }

  // 3.判断用户是否存在
  const result = await userService.getUserByName(name);
  const user = result[0];
  if (!user) {
    const error = new Error(errorTypes.USER_DOSE_NOT_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }

  // 4.用户已经存在了，判断密码是否相同（当然你要对传过来的密码进行相应的加密才能判断密码是否正确）
  if (md5password(password) !== user.password) {  // 密码是错误的
    const err = new Error(errorTypes.PASSWORD_IS_INCORRECT);
    return ctx.app.emit('error', err, ctx);
  }

  ctx.user = user;

  await next();
}

const verifyAuth = async (ctx, next) => {
  console.log("验证授权的middleware~");
  // 1.获取token
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit("error", error, ctx);
  }
  const token = authorization.replace("Bearer ", "");
  // 2.验证token(id/name/iat/exp)
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"]
    });
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    ctx.app.emit("error", error, ctx);
  }
}

/**
 * 1.很多的内容都需要验证权限：修改/删除动态，修改/删除评论
 * 2.接口：业务接口系统/后台管理系统的接口
 *  一对一 ：user -> role
 *  多对多 ：role -> menu(删除动态/修改动态)
*/
// 1.思路一
const verifyPermission = async (ctx, next) => {
  console.log("验证权限的middleware~");
  // 1.获取参数（评论id/用户id）
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace('Id', "");
  const resourceId = ctx.params[resourceKey];
  const { id } = ctx.user;

  // 2.查询是否有权限
  try {
    const isPermission = await authService.checkResource(tableName, resourceId, id);
    if (!isPermission) throw new Error();
  } catch (err) {
    const error = new Error(errorTypes.UNPERMISSION);
    return ctx.app.emit('error', error, ctx);
  }
  
  await next();
}

// 2.思路二
// const verifyPermission = (tableName) => {
//   console.log("验证权限的middleware~");
//   // 1.获取参数（评论id/用户id）
//   const { momentId } = ctx.params;
//   const { id } = ctx.user;

//   // 2.查询是否有权限
//   try {
//     const isPermission = await authService.checkResource(tableName, momentId, id);
//     if (!isPermission) throw new Error();
//   } catch (err) {
//     const error = new Error(errorTypes.UNPERMISSION);
//     return ctx.app.emit('error', error, ctx);
//   }
  
//   await next();
// }

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
};