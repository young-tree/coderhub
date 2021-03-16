const Koa = require("koa");  // npm install koa
const bodyParser = require("koa-bodyparser");  // npm install koa-bodyparser

const errorHandler = require("./error-handle");
const useRoutes = require('../router');

const app = new Koa();

// 方式一
// app.use(bodyParser())
// useRoutes(app);
// app.on("error", errorHandler);

// 方式二
app.useRoutes = useRoutes;

app.use(bodyParser())
app.useRoutes(app);  // this的隐式绑定
app.on("error", errorHandler);

module.exports = app;