const Multer = require("koa-multer");  // npm install koa-multer
const Jimp = require("jimp");
const path = require("path");

const { AVATAR_PATH, PICTURE_PATH } = require('../constants/file-path');

const avatarUpload = Multer({
  dest: AVATAR_PATH  // 一运行就会创建
})

const avatarHandler = avatarUpload.single("avatar");

const pictureUpload = Multer({
  dest: PICTURE_PATH  // 一运行就会创建
})

const pictureHandler = pictureUpload.array("picture", 9);

const pictureResize = async (ctx, next) => {
  // 1.获取所有的图像信息
  const files = ctx.req.files;
  // console.log(files)
  // console.log(1)
  // 2.对图像进行处理(sharp 比较大/jimp 相对小)
  for (let file of files) {
    const destPath = path.join(file.destination, file.filename);
    // console.log(file)
    Jimp.read(file.path).then(image => {
      image.resize(1280, Jimp.AUTO).write(`${destPath}-large`);
      image.resize(640, Jimp.AUTO).write(`${destPath}-middle`);
      image.resize(320, Jimp.AUTO).write(`${destPath}-small`);
    });
  }

  await next()
}

module.exports = {
  avatarHandler,
  pictureHandler,
  pictureResize
}