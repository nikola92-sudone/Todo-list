// src/logic/taskStore.js

let todos = JSON.parse(localStorage.getItem('myTodos')) || [];
let categories = JSON.parse(localStorage.getItem('myCategories')) || ['General'];
let currentPage = localStorage.getItem('myCurrentPage') || 'General';

// --- THE UNDO / REDO HISTORY SYSTEM ---
let history = []; 
let redoStack = []; // Our new "future" timeline

function saveSnapshot() {
    // 1. Any time you make a NEW change, the old "future" is destroyed
    redoStack = []; 
    
    // 2. Save the current state to history
    history.push({
        todos: JSON.parse(JSON.stringify(todos)),
        categories: JSON.parse(JSON.stringify(categories)),
        currentPage: currentPage
    });
    
    if (history.length > 15) history.shift();
}

export function undoAction() {
    if (history.length === 0) return false; 
    
    // 1. Save our CURRENT state to the redoStack before we go backwards
    redoStack.push({
        todos: JSON.parse(JSON.stringify(todos)),
        categories: JSON.parse(JSON.stringify(categories)),
        currentPage: currentPage
    });
    
    // 2. Travel back in time
    const prevState = history.pop();
    todos = prevState.todos;
    categories = prevState.categories;
    currentPage = prevState.currentPage;
    
    // 3. Save directly to local storage (Bulletproof!)
    localStorage.setItem('myTodos', JSON.stringify(todos));
    localStorage.setItem('myCategories', JSON.stringify(categories));
    localStorage.setItem('myCurrentPage', currentPage);
    
    return true; 
}

export function redoAction() {
    if (redoStack.length === 0) return false; // Nothing to redo

    // 1. Save our CURRENT state to history before we go forwards
    history.push({
        todos: JSON.parse(JSON.stringify(todos)),
        categories: JSON.parse(JSON.stringify(categories)),
        currentPage: currentPage
    });

    // 2. Travel forward in time
    const nextState = redoStack.pop();
    todos = nextState.todos;
    categories = nextState.categories;
    currentPage = nextState.currentPage;

    // 3. Save directly to local storage (Bulletproof!)
    localStorage.setItem('myTodos', JSON.stringify(todos));
    localStorage.setItem('myCategories', JSON.stringify(categories));
    localStorage.setItem('myCurrentPage', currentPage);

    return true;
}

// --- DATA LOGIC ---
export function getTodos() { return todos; }
export function getCategories() { return categories; }
export function getCurrentPage() { return currentPage; }

export function setCurrentPage(pageName) {
    currentPage = pageName;
    localStorage.setItem('myCurrentPage', currentPage);
}

export function addTodo(title, dueDate, description, category = 'General') {
    saveSnapshot(); 
    const newTodo = { id: Date.now().toString(), title, dueDate, description, category };
    todos.push(newTodo);
    localStorage.setItem('myTodos', JSON.stringify(todos));
    return newTodo;
}

export function deleteTodo(id) {
    saveSnapshot(); 
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('myTodos', JSON.stringify(todos));
}

export function renameCategory(oldName, newName) {
    if (newName === "" || oldName === newName) return;
    
    saveSnapshot(); 

    const index = categories.indexOf(oldName);
    if (index !== -1) {
        categories[index] = newName;
        localStorage.setItem('myCategories', JSON.stringify(categories));
    } else {
        return; 
    }

    todos.forEach(todo => {
        if (todo.category === oldName) {
            todo.category = newName;
        }
    });
    localStorage.setItem('myTodos', JSON.stringify(todos));
    
    setCurrentPage(newName);
}