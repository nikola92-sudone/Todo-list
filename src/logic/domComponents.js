// src/logic/domComponents.js

// src/logic/domComponents.js

export function createTodoCard(todo) {
    const card = document.createElement('div');
    card.classList.add('todo-card');
    card.dataset.id = todo.id; 
    
    if (todo.isComplete) {
        card.classList.add('completed'); 
    }

    card.innerHTML = `
      <div class="todo-header">
        <button class="checklist-toggle" title="Checklist Toggle">
            ${todo.isComplete ? '[✔]' : '[ ]'} 
        </button>
        
        <h3 class="title editable-text" contenteditable="true" spellcheck="false"></h3>
        
        <div class="due-date-wrapper">
          <span style="color: #d32f2f;">due date: </span>
          <input type="date" class="edit-date-input" value="${todo.dueDate}">
        </div>
        
        <div class="actions">
          <button class="hide-btn">hide</button>
          <button class="delete-btn">delete</button>
        </div>
      </div>
      
      <div class="todo-body">
        <h4 class="description editable-text" contenteditable="true" spellcheck="false"></h4>
      </div>
    `;

    // Inject the text
    card.querySelector('.title').textContent = todo.title;
    card.querySelector('.description').textContent = todo.description;
    // (The date value is already injected directly into the HTML above)

    return card;
}

export function createTodoForm() {
    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');
    
    formContainer.innerHTML = `
        <form id="new-todo-form" style="display: none; margin-bottom: 20px;">
            <input type="text" id="task-title" placeholder="Task Title (e.g., Homework)">
            <input type="date" id="task-date">
            <input type="text" id="task-desc" placeholder="Brief description...">
            <select id="task-category"></select>
            <button type="submit">Save Task</button>
            <button type="button" id="cancel-task-btn">Cancel</button>
        </form>
    `;
    
    return formContainer;
}

// src/domComponents.js (add to bottom)

export function createIndexModal() {
    const overlay = document.createElement('div');
    overlay.id = 'index-modal-overlay';
    overlay.classList.add('hidden'); // Hidden by default

    overlay.innerHTML = `
        <div class="index-modal-content">
            <button id="close-index-btn">X</button>
            <h2>Table of Contents</h2>
            <ul id="category-list"></ul>
        </div>
    `;

    return overlay;
}