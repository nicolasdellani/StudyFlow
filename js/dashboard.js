// dashboard.js

// Greeting
const hour = new Date().getHours();
const greet = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
document.getElementById('greeting').textContent = `${greet}, ${currentUser.name.split(' ')[0]}! 👋`;

// Date
document.getElementById('headerDate').textContent = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long'
});

// Stats
function updateStats() {
  const tasks = getTasks();
  const done = tasks.filter(t => t.done).length;
  const pending = tasks.length - done;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  document.getElementById('statTotal').textContent = tasks.length;
  document.getElementById('statDone').textContent = done;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statProgress').textContent = pct + '%';
  document.getElementById('progressLabel').textContent = pct + '%';
  document.getElementById('progressFill').style.width = pct + '%';
}

// Recent tasks
function renderRecent() {
  const tasks = getTasks().slice(-5).reverse();
  const container = document.getElementById('recentTasksList');
  if (!tasks.length) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:.85rem;text-align:center;padding:1rem 0;">Nenhuma tarefa ainda.</p>';
    return;
  }
  container.innerHTML = tasks.map(t => {
    const subj = t.subjectId ? getSubjectById(t.subjectId) : null;
    return `
      <div class="task-item-mini">
        <div class="task-check ${t.done ? 'done' : ''}" onclick="toggleTask('${t.id}')">
          ${t.done ? '✓' : ''}
        </div>
        <span class="task-mini-title ${t.done ? 'done' : ''}">${t.title}</span>
        ${subj ? `<span class="badge badge-subject" style="background:${subj.color}22;color:${subj.color}">${subj.name}</span>` : ''}
      </div>
    `;
  }).join('');
}

function toggleTask(id) {
  const tasks = getTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx > -1) { tasks[idx].done = !tasks[idx].done; saveTasks(tasks); }
  updateStats(); renderRecent();
}

// Quick add form
populateSubjectSelect('quickSubject');

document.getElementById('quickAddForm').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('quickTitle').value.trim();
  if (!title) return;
  const tasks = getTasks();
  tasks.push({
    id: Date.now().toString(),
    userId: currentUser.id,
    title,
    desc: '',
    subjectId: document.getElementById('quickSubject').value,
    priority: document.getElementById('quickPriority').value,
    due: '',
    done: false,
    createdAt: new Date().toISOString()
  });
  saveTasks(tasks);
  document.getElementById('quickAddForm').reset();
  populateSubjectSelect('quickSubject');
  updateStats(); renderRecent();
});

updateStats();
renderRecent();
