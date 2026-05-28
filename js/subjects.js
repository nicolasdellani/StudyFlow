// subjects.js

let selectedColor = '#5B8AF0';

// Color picker
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    selectedColor = dot.dataset.color;
  });
});

function renderSubjects() {
  const subjects = getSubjects();
  const tasks = getTasks();
  const container = document.getElementById('subjectsList');
  const empty = document.getElementById('emptySubjects');

  if (!subjects.length) {
    container.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  container.innerHTML = subjects.map(s => {
    const subjTasks = tasks.filter(t => t.subjectId === s.id);
    const done = subjTasks.filter(t => t.done).length;
    const pct = subjTasks.length ? Math.round((done / subjTasks.length) * 100) : 0;
    return `
      <div class="subject-card">
        <div class="subject-card-header" style="background:${s.color}"></div>
        <div class="subject-card-body">
          <div class="subject-name">${s.name}</div>
          <div class="subject-stats">${subjTasks.length} tarefa${subjTasks.length !== 1 ? 's' : ''} · ${done} concluída${done !== 1 ? 's' : ''}</div>
          <div class="subject-progress-bar">
            <div class="subject-progress-fill" style="width:${pct}%;background:${s.color}"></div>
          </div>
          <div class="subject-card-footer">
            <button class="btn-secondary" style="flex:1;font-size:.8rem;padding:.5rem" onclick="deleteSubject('${s.id}')">Excluir</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function deleteSubject(id) {
  if (!confirm('Excluir esta matéria? As tarefas associadas perderão a matéria.')) return;
  const subjects = getSubjects().filter(s => s.id !== id);
  saveSubjects(subjects);
  // unlink tasks
  const tasks = getTasks().map(t => t.subjectId === id ? { ...t, subjectId: '' } : t);
  saveTasks(tasks);
  renderSubjects();
}

// Modal
function openModal() { document.getElementById('subjectModal').classList.remove('hidden'); }
function closeModal() {
  document.getElementById('subjectModal').classList.add('hidden');
  document.getElementById('subjectForm').reset();
}

document.getElementById('openSubjectModalBtn').addEventListener('click', openModal);
document.getElementById('emptySubjectBtn')?.addEventListener('click', openModal);
document.getElementById('closeSubjectModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelSubjectBtn').addEventListener('click', closeModal);
document.getElementById('subjectModal').addEventListener('click', e => {
  if (e.target === document.getElementById('subjectModal')) closeModal();
});

document.getElementById('subjectForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('subjectName').value.trim();
  if (!name) return;
  const subjects = getSubjects();
  subjects.push({
    id: Date.now().toString(),
    userId: currentUser.id,
    name,
    color: selectedColor
  });
  saveSubjects(subjects);
  closeModal();
  renderSubjects();
});

renderSubjects();
