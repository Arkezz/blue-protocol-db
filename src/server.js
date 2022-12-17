const Koa = require("koa");
const { koaBody } = require("koa-body");
const helmet = require("koa-helmet");
const cors = require("@koa/cors");
const chalk = require("chalk");
const compress = require("koa-compress");
const conditional = require("koa-conditional-get");
const etag = require("koa-etag");
const responseTime = require("koa-response-time");

const router = require("./routes/api");

(async () => {
  const app = new Koa();
  const port = process.env.PORT || 3000;

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      console.error(error);
      ctx.status = error.status || 500;
      ctx.body = error.message;
    }
  });

  app.use(koaBody());
  app.use(helmet());
  app.use(cors());

  app.use(router.routes());

  app.use(responseTime());
  app.use(compress());
  app.use(conditional());
  app.use(etag());

  app.listen(port, () => {
    console.log(chalk.green(`Server listening on port ${port}`));
  });
})();