// src/domComponents.js

export function createTodoCard(todo) {
    const card = document.createElement('div');
    card.classList.add('todo-card');
    card.dataset.id = todo.id; // Attach the ID to the HTML element

    // 1. Build the structure
    card.innerHTML = `
      <div class="todo-header">
        <button class="checklist-toggle" title="Checklist Toggle">[ ]</button>
        <h3 class="title"></h3>
        <h5 class="due-date"></h5>
        
        <div class="actions">
          <button class="hide-btn">hide</button>
          <button class="delete-btn">delete</button>
        </div>
      </div>
      
      <div class="todo-body">
        <h4 class="description"></h4>
      </div>
    `;

    // 2. Safely inject the typed data
    card.querySelector('.title').textContent = `title: ${todo.title}`;
    card.querySelector('.due-date').textContent = `due date: ${todo.dueDate}`;
    card.querySelector('.description').textContent = `Description: ${todo.description}`;

    return card;
}

export function createTodoForm() {
    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');
    
    formContainer.innerHTML = `
        <form id="new-todo-form" style="display: none; margin-bottom: 20px;">
            <input type="text" id="task-title" placeholder="Task Title (e.g., Homework)" required>
            <input type="date" id="task-date" required>
            <input type="text" id="task-desc" placeholder="Brief description...">
            <select id="task-category"></select>
            <button type="submit">Save Task</button>
            <button type="button" id="cancel-task-btn">Cancel</button>
        </form>
    `;
    
    return formContainer;
}