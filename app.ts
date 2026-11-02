// A todo is an object with 3 things
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// our data
let todoList: Todo[] = [];
let currentFilter: string = 'all';
let nextId: number = 1;

// DOM: select the elements
const todoInput = document.getElementById('todoInput') as HTMLInputElement;
const addBtn = document.getElementById('addBtn') as HTMLButtonElement;
const listEl = document.getElementById('todoList') as HTMLUListElement;
const filterBox = document.getElementById('filters') as HTMLDivElement;
const countEl = document.getElementById('count') as HTMLSpanElement;
const clearDoneBtn = document.getElementById('clearCompleted') as HTMLButtonElement;
const clearAllBtn = document.getElementById('clearAll') as HTMLButtonElement;

// show everything on the page
function render(): void {
  listEl.innerHTML = '';

  for (const todo of todoList) {
    // skip todos that do not match the selected filter
    if (currentFilter === 'active' && todo.done) continue;
    if (currentFilter === 'completed' && !todo.done) continue;

    const li = document.createElement('li');
    li.className = todo.done ? 'todo-item done' : 'todo-item';
    li.dataset.id = String(todo.id);

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'check';
    check.checked = todo.done;

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '🗑';

    li.append(check, span, del);
    listEl.appendChild(li);
  }

  // items left
  let left = 0;
  for (const todo of todoList) {
    if (!todo.done) left++;
  }
  countEl.textContent = left + ' items left';

  // highlight the selected filter button
  const buttons = filterBox.querySelectorAll('button');
  buttons.forEach(b => {
    b.classList.toggle('active', b.dataset.filter === currentFilter);
  });
}

// add a todo
function addTodo(): void {
  const text = todoInput.value.trim();
  if (text === '') return;

  todoList.push({ id: nextId, text: text, done: false });
  nextId++;

  todoInput.value = '';
  render();
}

// events
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') addTodo();
});

// one listener for the whole list (event delegation)
listEl.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement;
  const li = target.closest('li');
  if (!li) return;
  const id = Number(li.dataset.id);

  if (target.classList.contains('check')) {
    // tick / untick
    for (const todo of todoList) {
      if (todo.id === id) todo.done = !todo.done;
    }
  } else if (target.classList.contains('delete-btn')) {
    // delete
    todoList = todoList.filter(todo => todo.id !== id);
  } else {
    return; // clicked somewhere else: do nothing
  }
  render();
});

// double-click a todo to edit it
listEl.addEventListener('dblclick', (e: Event) => {
  const target = e.target as HTMLElement;
  if (!target.classList.contains('todo-text')) return;
  const li = target.closest('li') as HTMLLIElement;
  const id = Number(li.dataset.id);

  const newText = prompt('Edit your todo:', target.textContent || '');
  if (newText && newText.trim() !== '') {
    for (const todo of todoList) {
      if (todo.id === id) todo.text = newText.trim();
    }
    render();
  }
});

// filter buttons
filterBox.addEventListener('click', (e: Event) => {
  const btn = e.target as HTMLElement;
  if (btn.nodeName !== 'BUTTON') return;
  currentFilter = btn.dataset.filter || 'all';
  render();
});

clearDoneBtn.addEventListener('click', () => {
  todoList = todoList.filter(todo => !todo.done);
  render();
});

clearAllBtn.addEventListener('click', () => {
  todoList = [];
  render();
});

render();