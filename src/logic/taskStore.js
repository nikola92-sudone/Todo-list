// src/logic/taskStore.js

// --- 1. THE DATA (Keep these at the very top!) ---
let todos = JSON.parse(localStorage.getItem('myTodos')) || [];
let categories = JSON.parse(localStorage.getItem('myCategories')) || ['General', 'Basketball', 'Golf'];

// --- 2. TODO LOGIC ---
export function getTodos() {
    return todos;
}

export function addTodo(title, dueDate, description, category = 'General') {
    const newTodo = {
        id: Date.now().toString(),
        title,
        dueDate,
        description,
        category
    };
    
    todos.push(newTodo);
    saveTodos();
    return newTodo;
}

export function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
}

function saveTodos() {
    localStorage.setItem('myTodos', JSON.stringify(todos));
}

// --- 3. CATEGORY LOGIC ---
export function getCategories() {
    return categories;
}

export function addCategory(newCategory) {
    if (!categories.includes(newCategory)) {
        categories.push(newCategory);
        saveCategories();
    }
}

function saveCategories() {
    localStorage.setItem('myCategories', JSON.stringify(categories));
}