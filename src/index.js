import './style.css';

// src/index.js
import { createTodoForm } from './logic/domComponents.js';
import { renderTodos, setupFormListeners } from './logic/taskController.js';

// 1. Inject the form into the notebook page (above the content)
const notebookPage = document.querySelector('#notebook-page');
const contentArea = document.querySelector('#Content');
const formElement = createTodoForm();

notebookPage.appendChild(formElement);

// 2. Set up the event listeners for the form and buttons
setupFormListeners();

// 3. Render any tasks that are already saved in localStorage
renderTodos();