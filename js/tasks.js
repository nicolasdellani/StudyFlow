// tasks.js

let currentFilter = 'all';
let filterSubject = '';
let filterPriority = '';
let editingId = null;

populateSubjectSelect('taskSubject');
populateSubjectSelect('filterSubject', false);
document.getElementById('filterSubject').insertAdjacentHTML('afterbegin', '<option value="">Todas as matérias</option>');

// Render tasks
function renderTasks() {
  let tasks = getTasks();

  if (currentFilter === 'pending') tasks = tasks.filter(t => !t.done);
  if (currentFilter === 'done') tasks = tasks.filter(t => t.done);
  if (filterSubject) tasks = tasks.filter(t => t.subjectId === filterSubject);
  if (filterPriority) tasks = tasks.filter(t => t.priority === filterPriority);

  const container = document.getElementById('tasksList');
  const empty = document.getElementById('emptyState');

  if (!tasks.length) {
    container.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  container.innerHTML = tasks.reverse().map(t => {
    const subj = t.subjectId ? getSubjectById(t.subjectId) : null;
    const dueFmt = formatDate(t.due);
    const overdue = !t.done && isOverdue(t.due);
    return `
      <div class="task-card ${t.done ? 'done-card' : ''}">
        <div class="task-card-check ${t.done ? 'done' : ''}" onclick="toggleTask('${t.id}')">
          ${t.done ? '✓' : ''}
        </div>
        <div class="task-card-body">
          <div class="task-card-title ${t.done ? 'done' : ''}">${t.title}</div>
          ${t.desc ? `<div class="task-card-desc">${t.desc}</div>` : ''}
          <div class="task-meta">
            ${subj ? `<span class="badge badge-subject" style="background:${subj.color}22;color:${subj.color}">${subj.name}</span>` : ''}
            <span class="badge badge-${t.priority}">${priorityLabel(t.priority)}</span>
            ${dueFmt ? `<span class="badge badge-due ${overdue ? 'overdue' : ''}">${overdue ? '⚠ ' : ''}${dueFmt}</span>` : ''}
          </div>
        </div>
        <div class="task-card-actions">
          <button class="btn-icon" title="Editar" onclick="openEdit('${t.id}')">✎</button>
          <button class="btn-icon danger" title="Excluir" onclick="deleteTask('${t.id}')">✕</button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleTask(id) {
  const tasks = getTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx > -1) { tasks[idx].done = !tasks[idx].done; saveTasks(tasks); }
  renderTasks();
}

function deleteTask(id) {
  if (!confirm('Excluir esta tarefa?')) return;
  saveTasks(getTasks().filter(t => t.id !== id));
  renderTasks();
}

function openEdit(id) {
  const task = getTasks().find(t => t.id === id);
  if (!task) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = 'Editar Tarefa';
  document.getElementById('taskId').value = id;
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDesc').value = task.desc || '';
  document.getElementById('taskSubject').value = task.subjectId || '';
  document.getElementById('taskPriority').value = task.priority || 'medium';
  document.getElementById('taskDue').value = task.due || '';
  openModal();
}

// Modal
function openModal() {
  document.getElementById('taskModal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('taskModal').classList.add('hidden');
  document.getElementById('taskForm').reset();
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Nova Tarefa';
}

document.getElementById('openModalBtn').addEventListener('click', openModal);
document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('emptyAddBtn')?.addEventListener('click', openModal);
document.getElementById('taskModal').addEventListener('click', e => {
  if (e.target === document.getElementById('taskModal')) closeModal();
});

// Save task
document.getElementById('taskForm').addEventListener('submit', e => {
  e.preventDefault();
  const tasks = getTasks();
  const title = document.getElementById('taskTitle').value.trim();
  if (!title) return;

  if (editingId) {
    const idx = tasks.findIndex(t => t.id === editingId);
    if (idx > -1) {
      tasks[idx] = { ...tasks[idx],
        title,
        desc: document.getElementById('taskDesc').value.trim(),
        subjectId: document.getElementById('taskSubject').value,
        priority: document.getElementById('taskPriority').value,
        due: document.getElementById('taskDue').value
      };
    }
  } else {
    tasks.push({
      id: Date.now().toString(),
      userId: currentUser.id,
      title,
      desc: document.getElementById('taskDesc').value.trim(),
      subjectId: document.getElementById('taskSubject').value,
      priority: document.getElementById('taskPriority').value,
      due: document.getElementById('taskDue').value,
      done: false,
      createdAt: new Date().toISOString()
    });
  }

  saveTasks(tasks);
  closeModal();
  renderTasks();
});

// Filters
document.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

document.getElementById('filterSubject').addEventListener('change', e => {
  filterSubject = e.target.value;
  renderTasks();
});

document.getElementById('filterPriority').addEventListener('change', e => {
  filterPriority = e.target.value;
  renderTasks();
});

renderTasks();
