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

// src/logic/taskStore.js

export function setCurrentPage(pageName) {
    currentPage = pageName;
    localStorage.setItem('myCurrentPage', currentPage);

    // NEW: The MRU Sorting Logic!
    const index = categories.indexOf(pageName);
    if (index > -1) {
        categories.splice(index, 1);      // 1. Remove it from its old spot
        categories.unshift(pageName);     // 2. Push it to the very top!
        localStorage.setItem('myCategories', JSON.stringify(categories)); // 3. Save the new order
    }
}

export function addTodo(title, dueDate, description, category = 'General') {
    saveSnapshot(); 
    // NEW: Added isComplete: false
    const newTodo = { id: Date.now().toString(), title, dueDate, description, category, isComplete: false };
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

export function addCategory() {
    saveSnapshot(); // Keeps your Undo/Redo working!
    
    let baseName = 'New Page';
    let newName = baseName;
    let counter = 2;

    // Check if the name already exists, and add a number if it does
    while (categories.includes(newName)) {
        newName = `${baseName} (${counter})`;
        counter++;
    }

    // Add it to our array and save to local storage
    categories.push(newName);
    localStorage.setItem('myCategories', JSON.stringify(categories));
    
    // Automatically flip the notebook to this new page!
    setCurrentPage(newName); 
    
    return newName;
}

// src/logic/taskStore.js

export function deleteCategory(categoryName) {
    // 1. Safety check: Don't let them delete the last page!
    if (categories.length <= 1) {
        alert("You can't delete your last page!");
        return false; 
    }

    saveSnapshot(); // Save history for Undo

    // 2. Remove the category from the list
    categories = categories.filter(cat => cat !== categoryName);
    localStorage.setItem('myCategories', JSON.stringify(categories));

    // 3. Delete all tasks that belonged to this page
    todos = todos.filter(todo => todo.category !== categoryName);
    localStorage.setItem('myTodos', JSON.stringify(todos));

    // 4. If we just deleted the page we were currently looking at, turn to page 1
    if (currentPage === categoryName) {
        setCurrentPage(categories[0]); 
    }

    return true; 
}

export function toggleTodoComplete(id) {
    saveSnapshot(); // Keeps Undo working!
    const todo = todos.find(t => t.id === id);
    if (todo) {
        // Flips it: true becomes false, false becomes true
        todo.isComplete = !todo.isComplete; 
        localStorage.setItem('myTodos', JSON.stringify(todos));
    }
}

// src/logic/taskStore.js

export function editTodo(id, newTitle, newDate, newDesc) {
    saveSnapshot(); // Save for Undo/Redo

    const todo = todos.find(t => t.id === id);
    if (todo) {
        // Only update the fields that were actually passed in
        if (newTitle !== undefined) todo.title = newTitle;
        if (newDate !== undefined) todo.dueDate = newDate;
        if (newDesc !== undefined) todo.description = newDesc;
        
        localStorage.setItem('myTodos', JSON.stringify(todos));
    }
}