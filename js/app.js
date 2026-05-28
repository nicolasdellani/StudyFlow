// app.js — Shared utilities for all app pages

// ── Auth guard ──────────────────────────────────────────────
const currentUser = JSON.parse(localStorage.getItem('sf_current_user') || 'null');
if (!currentUser) {
  window.location.href = '../index.html';
}

// ── UI init ──────────────────────────────────────────────────
function initUI() {
  const avatar = document.getElementById('userAvatar');
  const name = document.getElementById('userName');
  if (avatar && name) {
    avatar.textContent = currentUser.name.charAt(0).toUpperCase();
    name.textContent = currentUser.name.split(' ')[0];
  }
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('sf_current_user');
    window.location.href = '../index.html';
  });
}
initUI();

// ── Data helpers ─────────────────────────────────────────────
function getTasks() {
  const all = JSON.parse(localStorage.getItem('sf_tasks') || '[]');
  return all.filter(t => t.userId === currentUser.id);
}

function saveTasks(tasks) {
  const all = JSON.parse(localStorage.getItem('sf_tasks') || '[]');
  const other = all.filter(t => t.userId !== currentUser.id);
  localStorage.setItem('sf_tasks', JSON.stringify([...other, ...tasks]));
}

function getSubjects() {
  const all = JSON.parse(localStorage.getItem('sf_subjects') || '[]');
  return all.filter(s => s.userId === currentUser.id);
}

function saveSubjects(subjects) {
  const all = JSON.parse(localStorage.getItem('sf_subjects') || '[]');
  const other = all.filter(s => s.userId !== currentUser.id);
  localStorage.setItem('sf_subjects', JSON.stringify([...other, ...subjects]));
}

function getSubjectById(id) {
  return getSubjects().find(s => s.id === id) || null;
}

function populateSubjectSelect(selectId, includeEmpty = true) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const subjects = getSubjects();
  sel.innerHTML = includeEmpty ? '<option value="">Sem matéria</option>' : '<option value="">Todas as matérias</option>';
  subjects.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.name;
    sel.appendChild(opt);
  });
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(dateStr + 'T00:00:00');
  return due < today;
}

function priorityLabel(p) {
  return { high: 'Alta', medium: 'Média', low: 'Baixa' }[p] || p;
}
