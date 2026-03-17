import './style.css';
import { createTodoForm } from './logic/domComponents.js';
import { 
    renderTodos, 
    setupFormListeners, 
    setupTitleListener, 
    setupUndoListener 
} from './logic/taskController.js';

// 1. Grab the main notebook page area
const notebookPage = document.querySelector('#notebook-page');

// 2. Create the form and append it to the bottom of the page
const formElement = createTodoForm();
notebookPage.appendChild(formElement);

// 3. Initialize all our event listeners (The Brains)
setupFormListeners();
setupTitleListener();
setupUndoListener(); // <--- Turns on the Ctrl + Z feature!

// 4. Initial render of the tasks and title to the screen
renderTodos();