// src/index.js
import './style.css';
import { createTodoForm, createIndexModal } from './logic/domComponents.js'; 

import { 
    renderTodos, 
    setupFormListeners, 
    setupTitleListener, 
    setupUndoListener,
    setupCategoryListeners, 
    setupIndexModalListeners 
} from './logic/taskController.js';

const notebookPage = document.querySelector('#notebook-page');

// 1. Add the Form
const formElement = createTodoForm();
notebookPage.appendChild(formElement);

// 2. Add the Index Modal to the page! (If this is missing, the whole app breaks)
const modalElement = createIndexModal();
document.body.appendChild(modalElement);

// 3. Initialize all our event listeners
setupFormListeners();
setupTitleListener();
setupUndoListener(); 
setupCategoryListeners(); 
setupIndexModalListeners(); // Turns on the modal buttons

// 4. Initial render
renderTodos();