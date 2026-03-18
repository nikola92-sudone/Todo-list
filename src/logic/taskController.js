// src/taskController.js
// src/taskController.js
import { 
    getTodos, 
    addTodo, 
    deleteTodo, 
    getCategories, 
    getCurrentPage, 
    renameCategory, 
    undoAction, 
    redoAction, 
    addCategory,
    setCurrentPage,
    deleteCategory,
    toggleTodoComplete,
    editTodo
} from './taskStore.js';
import { createTodoCard } from './domComponents.js';

// src/logic/taskController.js

export function renderTabs() {
    const tabsContainer = document.querySelector('#side-tabs');
    if (!tabsContainer) return; 
    
    tabsContainer.innerHTML = ''; // Clear old tabs
    
    const categories = getCategories();
    const currentPage = getCurrentPage();
    
    // 1. Remove the current page from the main list so we don't duplicate it
    const otherCategories = categories.filter(cat => cat !== currentPage);
    
    // 2. Put the Current Page first, then add the rest, and slice the top 5!
    const topCategories = [currentPage, ...otherCategories].slice(0, 5);
    
    topCategories.forEach(cat => {
        const tab = document.createElement('div');
        tab.classList.add('side-tab');
        tab.textContent = cat;
        
        // Make the tab clickable!
        tab.addEventListener('click', () => {
            setCurrentPage(cat);
            renderTodos(); 
        });
        
        tabsContainer.appendChild(tab);
    });
}

// src/logic/taskController.js

export function renderTodos() {
    const contentArea = document.querySelector('#Content');
    const pageTitleInput = document.querySelector('#page-title-input'); 
    
    // 1. Set the page title at the top
    pageTitleInput.textContent = getCurrentPage();
    
    // 2. Clear the board for a fresh render
    contentArea.innerHTML = ''; 
    
    // 3. Filter tasks so we ONLY see tasks for the current page
    const currentCategory = getCurrentPage();
    const todos = getTodos().filter(todo => todo.category === currentCategory);
    
    // 4. Split tasks into active and completed
    const activeTodos = todos.filter(todo => !todo.isComplete);
    const completedTodos = todos.filter(todo => todo.isComplete);

    // 5. Helper function to attach all event listeners to a specific card
    function attachListeners(card, todo) {
        
        // --- Delete Button ---
        card.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTodo(todo.id); 
            renderTodos();       
        });
        
        // --- Toggle Complete Button ---
        card.querySelector('.checklist-toggle').addEventListener('click', () => {
            toggleTodoComplete(todo.id);
            renderTodos(); 
        });

        // --- Inline Edit Listeners ---
        const titleEl = card.querySelector('.title');
        const descEl = card.querySelector('.description');
        const dateInput = card.querySelector('.edit-date-input');

        // Save Title on blur (clicking away)
        titleEl.addEventListener('blur', () => {
            editTodo(todo.id, titleEl.textContent.trim(), undefined, undefined);
        });
        
        // Save Title on Enter key
        titleEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Stop it from making a new line
                titleEl.blur();     // Triggers the save!
            }
        });

        // Save Description
        descEl.addEventListener('blur', () => {
            editTodo(todo.id, undefined, undefined, descEl.textContent.trim());
        });
        
        // Save Description on Enter (Allow Shift+Enter for new lines)
        descEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { 
                e.preventDefault();
                descEl.blur();
            }
        });

        // Save Date automatically when changed using the calendar
        if (dateInput) {
            dateInput.addEventListener('change', () => {
                editTodo(todo.id, undefined, dateInput.value, undefined);
            });
        }
    }

    // 6. Render Active Tasks First
    activeTodos.forEach(todo => {
        const card = createTodoCard(todo);
        attachListeners(card, todo);
        contentArea.appendChild(card);
    });

    // 7. Draw the Separator line if there are completed tasks
    if (completedTodos.length > 0) {
        const separator = document.createElement('div');
        separator.classList.add('completed-separator');
        contentArea.appendChild(separator);
    }

    // 8. Render Completed Tasks at the bottom
    completedTodos.forEach(todo => {
        const card = createTodoCard(todo);
        attachListeners(card, todo);
        contentArea.appendChild(card);
    });

    // 9. Render the side tabs! (Perfectly placed at the very end)
    renderTabs(); 
}


// 2. Update your existing "+ New Page" click listener 
// Helper function to build the dropdown options
function updateCategoryDropdown() {
    const dropdown = document.querySelector('#task-category');
    dropdown.innerHTML = ''; // Clear out any old options
    
    const categories = getCategories(); 
    
    // Loop through your pages and create an <option> for each
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
    });

    // --- THE FIX: Automatically select the current page! ---
    const currentPage = getCurrentPage();
    if (categories.includes(currentPage)) {
        dropdown.value = currentPage; 
    }
}

// The single, unified listener setup
export function setupFormListeners() {
    const form = document.querySelector('#new-todo-form');
    const addPageBtn = document.querySelector('#add-page-btn');
    const cancelBtn = document.querySelector('#cancel-task-btn');

    // Show the form and update dropdown when "+ New Page" is clicked
    addPageBtn.addEventListener('click', () => {
        updateCategoryDropdown(); 
        form.style.display = 'grid'; // <--- CHANGE THIS FROM 'block' TO 'grid'
    });

    // Hide the form on cancel
    cancelBtn.addEventListener('click', () => {
        form.style.display = 'none';
        form.reset();
    });

    // Handle the actual submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.querySelector('#task-title').value;
        const date = document.querySelector('#task-date').value;
        const desc = document.querySelector('#task-desc').value;
        const category = document.querySelector('#task-category').value;

        addTodo(title, date, desc, category); // Save to data
        
        form.reset();
        form.style.display = 'none';
        
        renderTodos(); // Update the screen
    });
}

export function setupTitleListener() {
    const pageTitleInput = document.querySelector('#page-title-input');

    // 1. Listen for the Enter key
    pageTitleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Stops it from making a double-line break
            pageTitleInput.blur(); // Triggers the save function below
        }
    });

    // 2. THE MISSING PIECE: Actually saving the data
    pageTitleInput.addEventListener('blur', () => {
        const oldName = getCurrentPage(); 
        const newName = pageTitleInput.textContent.trim(); // Grabs exactly what you typed

        // If the name changed and isn't blank, save it!
        if (newName !== oldName && newName !== "") {
            renameCategory(oldName, newName); // Updates the Store
            renderTodos(); // Refreshes the screen
        } else {
            // If they left it blank, revert it back to the old name
            pageTitleInput.textContent = oldName;
        }
    });
}

// src/logic/taskController.js (add to bottom)

export function setupUndoListener() {
    document.addEventListener('keydown', (e) => {
        
        // Prevent triggering if typing in an input box
        const activeEl = document.activeElement;
        if (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable) {
            return; 
        }

        // --- UNDO: Ctrl + Z (But NOT holding Shift) ---
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault(); 
            if (undoAction()) {
                renderTodos(); 
            }
        }

        // --- REDO: Ctrl + Y  -OR-  Ctrl + Shift + Z ---
        if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault();
            if (redoAction()) {
                renderTodos();
            }
        }
    });
}

export function setupCategoryListeners() {
    const addCategoryBtn = document.querySelector('#add-category-btn');

    addCategoryBtn.addEventListener('click', () => {
        addCategory();   // Creates the new page in taskStore
        renderTodos();   // Refreshes the screen (clears old tasks, updates title)
    });
}

// src/logic/taskController.js (add to bottom)
// src/logic/taskController.js

export function setupIndexModalListeners() {
    const indexBtn = document.querySelector('#index-btn');
    const modalOverlay = document.querySelector('#index-modal-overlay');
    const closeBtn = document.querySelector('#close-index-btn');
    const categoryList = document.querySelector('#category-list');

    // We put the list generation inside its own helper function so we can 
    // easily refresh it after deleting a page
    function populateList() {
        categoryList.innerHTML = ''; 
        const categories = getCategories();
        const current = getCurrentPage();

        categories.forEach(cat => {
            const li = document.createElement('li');
            li.classList.add('index-item');
            
            // 1. The clickable text for the page
            const textSpan = document.createElement('span');
            textSpan.textContent = cat;
            textSpan.classList.add('page-name');
            
            if (cat === current) {
                li.classList.add('active-page');
            }

            // Click the text to flip to that page
            textSpan.addEventListener('click', () => {
                setCurrentPage(cat); 
                renderTodos(); 
                modalOverlay.classList.add('hidden'); 
            });

            // 2. The Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '&#10006;'; // A nice 'X' character
            deleteBtn.classList.add('delete-page-btn');
            deleteBtn.title = 'Delete Page';
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Stops the click from hitting the row behind it
                
                // Add a confirmation popup just in case!
                if(confirm(`Are you sure you want to delete "${cat}" and all its tasks?`)) {
                    if (deleteCategory(cat)) {
                        populateList(); // Refresh the list inside the modal
                        renderTodos();  // Refresh the main screen behind the modal
                    }
                }
            });

            // Append both to the list item
            li.appendChild(textSpan);
            li.appendChild(deleteBtn);
            categoryList.appendChild(li);
        });
    }

    indexBtn.addEventListener('click', () => {
        populateList();
        modalOverlay.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
    });
}