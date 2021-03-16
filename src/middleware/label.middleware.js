const service = require("../service/label.service");

const verifyLabelExists = async (ctx, next) => {  // 验证获得的标签是否存在
  // 1.取出我们要验证的所有标签
  const {labels} = ctx.request.body;

  // 2.判断每一个标签在label表中是否存在
  const newLabels = [];
  for (let name of labels) {
    const labelResult = await service.getLabelByName(name);
    const label = {name};
    if (!labelResult) {
      // 创建标签数据
      const result = await service.create(name);
      label.id = result.insertId;
    } else {
      label.id = labelResult.id;
    }
    newLabels.push(label);
  }
  ctx.labels = newLabels;  // 获取到标签名和标签的id之后存储到labels中，给后面的程序用。

  await next();  // 如果存在再进行下一个中间件
}

module.exports = {
  verifyLabelExists
};