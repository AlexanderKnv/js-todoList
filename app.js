const todoList = document.getElementById('todo-list');
const userSelect = document.getElementById('user-todo');
const form = document.querySelector('form');

let todos = [];
let users = [];

document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit);

async function getAllTodos() {
    try {
        const response = await fetch(
            'https://jsonplaceholder.typicode.com/todos?_limit=15'
        );
        const data = await response.json();

        return data;
    } catch (error) {
        alertError(error);
    }
}

async function getAllUsers() {
    try {
        const response = await fetch(
            'https://jsonplaceholder.typicode.com/users?_limit=5'
        );
        const data = await response.json();
        return data;
    } catch (error) {
        alertError(error);
    }
}

function alertError(error) {
    alert(error.message);
}

function initApp() {
    Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
        [todos, users] = values;
        console.log(values)

        todos.forEach((todo) => printTodo(todo));
        users.forEach((user) => createUserOption(user));
    });
}

function printTodo({ id, userId, title, completed }) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
        userId
    )}</b></span>`;

    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = completed;

    const close = document.createElement('span');
    close.innerHTML = '&times;';
    close.className = 'close';

    li.prepend(status);
    li.append(close);

    todoList.prepend(li);
}

function getUserName(userId) {
    const user = users.find((u) => u.id === userId);
    return user.name;
}

function createUserOption(user) {
    const option = document.createElement('option');
    option.value = user.id;
    option.innerText = user.name;

    userSelect.append(option);
}

async function createTodo(todo) {
    try {
        const response = await fetch(
            'https://jsonplaceholder.typicode.com/todos',
        {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-Type': 'application/json',
            },
        }
        );

        const newTodo = await response.json();

        printTodo(newTodo);
    } catch (error) {
      alertError(error);
    }
}

function handleSubmit(event) {
    event.preventDefault();

    createTodo({
        userId: Number(form.user.value),
        title: form.todo.value,
        completed: false,
    });
}
