const http = require('http');

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Todo App</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f0f4f8;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      padding: 2rem;
      width: 100%;
      max-width: 480px;
    }
    h1 { font-size: 1.8rem; margin-bottom: 1.2rem; color: #1a202c; }
    .input-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.2rem;
    }
    input[type="text"] {
      flex: 1;
      padding: 0.6rem 0.9rem;
      border: 1.5px solid #cbd5e0;
      border-radius: 7px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="text"]:focus { border-color: #667eea; }
    button {
      padding: 0.6rem 1.1rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 7px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #5a67d8; }
    ul { list-style: none; }
    li {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.6rem 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 1rem;
      color: #2d3748;
    }
    li:last-child { border-bottom: none; }
    li.done span { text-decoration: line-through; color: #a0aec0; }
    li input[type="checkbox"] { accent-color: #667eea; width: 1.1em; height: 1.1em; }
    .del {
      margin-left: auto;
      background: none;
      color: #fc8181;
      font-size: 1.1rem;
      padding: 0 0.3rem;
    }
    .del:hover { background: none; color: #e53e3e; }
    .empty { color: #a0aec0; text-align: center; padding: 1rem 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 Todo App</h1>
    <div class="input-row">
      <input type="text" id="newTodo" placeholder="Add a new task..." />
      <button onclick="addTodo()">Add</button>
    </div>
    <ul id="todoList"><li class="empty">No tasks yet. Add one above!</li></ul>
  </div>
  <script>
    const todos = [];
    function render() {
      const list = document.getElementById('todoList');
      if (todos.length === 0) {
        list.innerHTML = '<li class="empty">No tasks yet. Add one above!</li>';
        return;
      }
      list.innerHTML = todos.map((t, i) =>
        '<li class="' + (t.done ? 'done' : '') + '">' +
          '<input type="checkbox" ' + (t.done ? 'checked' : '') + ' onchange="toggle(' + i + ')" />' +
          '<span>' + t.text.replace(/</g,'&lt;') + '</span>' +
          '<button class="del" onclick="remove(' + i + ')">✕</button>' +
        '</li>'
      ).join('');
    }
    function addTodo() {
      const input = document.getElementById('newTodo');
      const text = input.value.trim();
      if (!text) return;
      todos.push({ text, done: false });
      input.value = '';
      render();
    }
    function toggle(i) { todos[i].done = !todos[i].done; render(); }
    function remove(i) { todos.splice(i, 1); render(); }
    document.getElementById('newTodo').addEventListener('keydown', e => {
      if (e.key === 'Enter') addTodo();
    });
  </script>
</body>
</html>`;


const PORT = process.env.PORT;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(HTML_PAGE);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});