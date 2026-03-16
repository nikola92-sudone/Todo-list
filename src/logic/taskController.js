// src/taskController.js
import { getTodos, addTodo, deleteTodo, getCategories } from './taskStore.js';
import { createTodoCard } from './domComponents.js';

export function renderTodos() {
    const contentArea = document.querySelector('#Content');
    contentArea.innerHTML = ''; // Clear the board

    const todos = getTodos();
    
    // Loop through the data and append a card for each one
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
    
    // We import getCategories from taskStore at the top of this file
    const categories = getCategories(); 
    
    // Loop through your pages (e.g., Basketball, Tennis, General) and create an <option> for each
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
    });
}

// The single, unified listener setup
export function setupFormListeners() {
    const form = document.querySelector('#new-todo-form');
    const addPageBtn = document.querySelector('#add-page-btn');
    const cancelBtn = document.querySelector('#cancel-task-btn');

    // Show the form and update dropdown when "+ New Page" is clicked
    addPageBtn.addEventListener('click', () => {
        updateCategoryDropdown(); // Build the dynamic list!
        form.style.display = 'block';
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