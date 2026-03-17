// src/taskController.js
import { getTodos, addTodo, deleteTodo, getCategories, getCurrentPage, renameCategory, setCurrentPage, undoAction } from './taskStore.js';
import { createTodoCard } from './domComponents.js';

export function renderTodos() {
    const contentArea = document.querySelector('#Content');
    const pageTitleInput = document.querySelector('#page-title-input'); 
    
    // CHANGE .value TO .textContent HERE:
    pageTitleInput.textContent = getCurrentPage();
    
    // ... the rest stays the same

    // 2. Clear the board
    contentArea.innerHTML = ''; 
    
    // 3. Filter tasks so we ONLY see tasks for the current page
    const currentCategory = getCurrentPage();
    const todos = getTodos().filter(todo => todo.category === currentCategory);
    
    // ... the rest of the loop stays exactly the same ...
    todos.forEach(todo => {
        const card = createTodoCard(todo);
        
        // Add event listener for the delete button on this specific card
        card.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTodo(todo.id); // Remove from data
            renderTodos();       // Re-render the screen
        });

        contentArea.appendChild(card);
    });
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
        // Check for Ctrl + Z (or Cmd + Z on Mac)
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            
            // If the user is currently typing in an input box or the title, 
            // let the browser handle the normal text undo!
            const activeEl = document.activeElement;
            if (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable) {
                return; 
            }

            e.preventDefault(); // Stop default browser behavior
            
            // Call the undo function from the Store
            const didUndo = undoAction();
            if (didUndo) {
                renderTodos(); // Redraw the screen with the restored data!
            }
        }
    });
}