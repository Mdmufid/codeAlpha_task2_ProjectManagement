// Load all projects and display them
async function loadProjects() {
  try {
    const res = await fetch('http://localhost:5000/api/projects');
    const projects = await res.json();

    if (!Array.isArray(projects)) {
      throw new Error('Projects data is not in array format.');
    }

    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    for (const project of projects) {
      const projectDiv = document.createElement('div');
      projectDiv.className = 'project-card';
      projectDiv.innerHTML = `
        <h4>${project.name}</h4>
        <p>${project.description || ''}</p>
        <button class="btn btn-sm btn-outline-primary" onclick="loadTasks('${project._id}', this)">Show Tasks</button>
        <div class="task-list" id="task-${project._id}"></div>
        <hr>
        <h6>Create Task</h6>
        <input type="text" id="taskTitle-${project._id}" placeholder="Task Title" class="form-control mb-1">
        <button class="btn btn-sm btn-success" onclick="createTask('${project._id}')">Add Task</button>
      `;
      projectList.appendChild(projectDiv);
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// Create a new project and show success or error
async function createProject() {
  const name = document.getElementById('projectName').value.trim();
  const description = document.getElementById('projectDescription').value.trim();

  const messageContainer = document.getElementById('message-container');
  messageContainer.innerHTML = ''; // clear previous

  const message = document.createElement('div');
  message.className = 'alert alert-info';
  message.textContent = 'Creating project...';
  messageContainer.appendChild(message);

  try {
    const res = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });

    if (res.ok) {
      loadProjects();
      message.textContent = 'Project created successfully!';
      message.classList.remove('alert-info');
      message.classList.add('alert-success');
    } else {
      const errorData = await res.json();
      message.textContent = `Failed to create project: ${errorData.message || 'Unknown error'}`;
      message.classList.remove('alert-info');
      message.classList.add('alert-danger');
    }
  } catch (error) {
    console.error('Error creating project:', error);
    message.textContent = 'An error occurred.';
    message.classList.remove('alert-info');
    message.classList.add('alert-danger');
  }
}

// Create a new task for a specific project
async function createTask(projectId) {
  const title = document.getElementById(`taskTitle-${projectId}`).value;
  const existingMessage = document.getElementById('responseMessage');
  if (existingMessage) existingMessage.remove();

  const message = document.createElement('div');
  message.id = 'responseMessage';
  message.className = 'alert alert-info';
  message.textContent = 'Creating task...';
  document.body.appendChild(message);

  try {
    const res = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, project: projectId })
    });

    if (res.ok) {
      loadTasks(projectId);
      message.textContent = 'Task created successfully!';
      message.classList.remove('alert-info');
      message.classList.add('alert-success');
    } else {
      message.textContent = 'Failed to create task.';
      message.classList.remove('alert-info');
      message.classList.add('alert-danger');
    }
  } catch (error) {
    console.error('Error creating task:', error);
    message.textContent = 'An error occurred.';
    message.classList.remove('alert-info');
    message.classList.add('alert-danger');
  }
}

// Load tasks for a specific project
async function loadTasks(projectId, button) {
  try {
    const res = await fetch(`http://localhost:5000/api/tasks?project=${projectId}`);
    const tasks = await res.json();

    const container = document.getElementById(`task-${projectId}`);
    container.innerHTML = '';

    for (const task of tasks) {
      container.innerHTML += `
        <div><strong>${task.title}</strong> - ${task.status}</div>
        <div class="comment-box">
          <input type="text" placeholder="Add comment" id="comment-${task._id}" class="form-control form-control-sm mb-1">
          <button class="btn btn-sm btn-outline-secondary" onclick="addComment('${task._id}')">Comment</button>
          <div id="comments-${task._id}" class="mt-2"></div>
        </div>
      `;
      loadComments(task._id);
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

// Add a comment to a task
async function addComment(taskId) {
  const content = document.getElementById(`comment-${taskId}`).value;

  try {
    const res = await fetch('http://localhost:5000/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        task: taskId,
        user: '64d00c3a1c3a5a9ef5a4b7c9' // Placeholder user ID
      })
    });

    if (res.ok) {
      loadComments(taskId);
    }
  } catch (error) {
    console.error('Error adding comment:', error);
  }
}

// Load all comments for a task
async function loadComments(taskId) {
  try {
    const res = await fetch(`http://localhost:5000/api/comments/${taskId}`);
    const comments = await res.json();

    const container = document.getElementById(`comments-${taskId}`);
    container.innerHTML = '';
    comments.forEach(comment => {
      container.innerHTML += `<div><em>${comment.user?.username || 'User'}</em>: ${comment.content}</div>`;
    });
  } catch (error) {
    console.error('Error loading comments:', error);
  }
}
