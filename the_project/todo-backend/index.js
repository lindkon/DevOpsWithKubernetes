const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const PORT = process.env.PORT || 3000;

const app = new Koa();
const router = new Router();

let todos = [];

router.get('/todos', (ctx) => {
  ctx.status = 200;
  ctx.body = todos;
});

router.post('/todos', (ctx) => {
  const { todo } = ctx.request.body;

  if (!todo || typeof todo !== 'string' || todo.trim() === '') {
    ctx.status = 400;
    ctx.body = { error: 'todo required' };
    return;
  }

  const newTodo = { text: todo };
  todos.push(newTodo);

  ctx.status = 201;
  ctx.body = newTodo;
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});