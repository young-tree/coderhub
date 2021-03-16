const Router = require("koa-router");

const { 
  create,
  reply,
  update,
  remove,
  list
} = require("../controller/comment.controller");

const {
  verifyAuth,
  verifyPermission
} = require("../middleware/auth.middleware");

const commentRouter = new Router({prefix: "/comment"});

// 1.发布评论
commentRouter.post("/", verifyAuth, create);
// 2.回复评论
commentRouter.post("/:commentId/reply", verifyAuth, reply);
// 3.修改评论
// commentRouter.patch("/:commentId", verifyAuth, verifyPermission("不同的表名"), update);
commentRouter.patch("/:commentId", verifyAuth, verifyPermission, update);
// 4.删除评论
commentRouter.delete("/:commentId", verifyAuth, verifyPermission, remove);

// 5.根据动态获取评论的列表
commentRouter.get("/", list)

module.exports = commentRouter;