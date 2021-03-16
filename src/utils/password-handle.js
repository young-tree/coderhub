const crypto = require("crypto");

const md5password = (password) => {
  const md5 = crypto.createHash("md5");  // 对象
  // md5.update(password) 意思是把密码传进来，然后它本身是一个函数
  // 你想拿到我们最终的字符串需要调用一个函数叫做digest()，默认是二进制传入hex表示是16进制
  const result = md5.update(password).digest("hex");
  return result;
}

module.exports = md5password;