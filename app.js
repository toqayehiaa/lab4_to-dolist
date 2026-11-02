"use strict";
// our data
let todoList = [];
let currentFilter = 'all';
let nextId = 1;
// DOM: select the elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const listEl = document.getElementById('todoList');
const filterBox = document.getElementById('filters');
const countEl = document.getElementById('count');
const clearDoneBtn = document.getElementById('clearCompleted');
const clearAllBtn = document.getElementById('clearAll');
// show everything on the page
function render() {
    listEl.innerHTML = '';
    for (const todo of todoList) {
        // skip todos that do not match the selected filter
        if (currentFilter === 'active' && todo.done)
            continue;
        if (currentFilter === 'completed' && !todo.done)
            continue;
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
        if (!todo.done)
            left++;
    }
    countEl.textContent = left + ' items left';
    // highlight the selected filter button
    const buttons = filterBox.querySelectorAll('button');
    buttons.forEach(b => {
        b.classList.toggle('active', b.dataset.filter === currentFilter);
    });
}
// add a todo
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '')
        return;
    todoList.push({ id: nextId, text: text, done: false });
    nextId++;
    todoInput.value = '';
    render();
}
// events
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')
        addTodo();
});
// one listener for the whole list (event delegation)
listEl.addEventListener('click', (e) => {
    const target = e.target;
    const li = target.closest('li');
    if (!li)
        return;
    const id = Number(li.dataset.id);
    if (target.classList.contains('check')) {
        // tick / untick
        for (const todo of todoList) {
            if (todo.id === id)
                todo.done = !todo.done;
        }
    }
    else if (target.classList.contains('delete-btn')) {
        // delete
        todoList = todoList.filter(todo => todo.id !== id);
    }
    else {
        return; // clicked somewhere else: do nothing
    }
    render();
});
// double-click a todo to edit it
listEl.addEventListener('dblclick', (e) => {
    const target = e.target;
    if (!target.classList.contains('todo-text'))
        return;
    const li = target.closest('li');
    const id = Number(li.dataset.id);
    const newText = prompt('Edit your todo:', target.textContent || '');
    if (newText && newText.trim() !== '') {
        for (const todo of todoList) {
            if (todo.id === id)
                todo.text = newText.trim();
        }
        render();
    }
});
// filter buttons
filterBox.addEventListener('click', (e) => {
    const btn = e.target;
    if (btn.nodeName !== 'BUTTON')
        return;
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
