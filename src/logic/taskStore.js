// src/logic/taskStore.js

let todos = JSON.parse(localStorage.getItem('myTodos')) || [];
let categories = JSON.parse(localStorage.getItem('myCategories')) || ['General', 'Basketball', 'Tennis'];
let currentPage = localStorage.getItem('myCurrentPage') || 'General';

// --- THE UNDO HISTORY SYSTEM ---
let history = []; // Holds our snapshots

function saveSnapshot() {
    // Take a deep copy of the current state and push it to history
    history.push({
        todos: JSON.parse(JSON.stringify(todos)),
        categories: JSON.parse(JSON.stringify(categories)),
        currentPage: currentPage
    });
    
    // Don't let history get too massive, keep the last 15 actions
    if (history.length > 15) history.shift();
}

export function undoAction() {
    if (history.length === 0) return false; // Nothing to undo
    
    // Pop the last state out of history
    const prevState = history.pop();
    
    // Restore data
    todos = prevState.todos;
    categories = prevState.categories;
    currentPage = prevState.currentPage;
    
    // Save restored data to local storage
    localStorage.setItem('myTodos', JSON.stringify(todos));
    localStorage.setItem('myCategories', JSON.stringify(categories));
    localStorage.setItem('myCurrentPage', currentPage);
    
    return true; // Undo was successful
}

// --- YOUR EXISTING DATA LOGIC ---
export function getTodos() { return todos; }
export function getCategories() { return categories; }
export function getCurrentPage() { return currentPage; }

export function setCurrentPage(pageName) {
    currentPage = pageName;
    localStorage.setItem('myCurrentPage', pageName);
}

export function addTodo(title, dueDate, description, category = 'General') {
    saveSnapshot(); // <--- SNAPSHOT BEFORE ADDING
    const newTodo = { id: Date.now().toString(), title, dueDate, description, category };
    todos.push(newTodo);
    localStorage.setItem('myTodos', JSON.stringify(todos));
    return newTodo;
}

export function deleteTodo(id) {
    saveSnapshot(); // <--- SNAPSHOT BEFORE DELETING
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('myTodos', JSON.stringify(todos));
}

export function renameCategory(oldName, newName) {
    if (newName === "" || oldName === newName) return;
    
    saveSnapshot(); // <--- SNAPSHOT BEFORE RENAMING

    // 1. Update categories array safely
    const index = categories.indexOf(oldName);
    if (index !== -1) {
        categories[index] = newName;
    } else {
        categories.push(newName); // Bulletproof fallback
    }
    localStorage.setItem('myCategories', JSON.stringify(categories));

    // 2. Safely update tasks
    todos.forEach(todo => {
        if (todo.category === oldName) {
            todo.category = newName;
        }
    });
    localStorage.setItem('myTodos', JSON.stringify(todos));
    
    // 3. Set the new page
    setCurrentPage(newName);
}