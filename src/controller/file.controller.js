const fileService = require("../service/file.service");
const userService = require("../service/user.service");
const {APP_HOST, APP_PORT} = require("../app/config")

class FileController {
  async saveAvatarInfo(ctx, next) {
    // 1.获取图像相关的信息
    const { filename, mimetype, size } = ctx.req.file;
    const { id } = ctx.user;

    // 2.将图像信息数据保存到数据库中
    await fileService.createAvatar(filename, mimetype, size, id);

    // 3.将图片地址保存到user表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    await userService.updateAvatarUrlById(avatarUrl, id)  // 将头像地址保存到用户表中

    // 4.返回结果
    // ctx.body = {
    //   stateCode: 1110,
    //   message: {

    //   }
    // };
    ctx.body = "上传头像成功~";
  }

  async savePictureInfo(ctx, next) {
    // 1.获取图像相关的信息
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { momentId } = ctx.query;
    // 2.将所有的文件信息保存到数据库中
    for (let file of files) {
      const { filename, mimetype, size } = file;  // 取到信息
      await fileService.createPicture(filename, mimetype, size, id, momentId);
    }

    ctx.body = "动态配图上传完成~"
  }
}

module.exports = new FileController();