// auth.js — Login & Register logic

const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.auth-form');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
  });
});

// Helpers
function getUsers() {
  return JSON.parse(localStorage.getItem('sf_users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('sf_users', JSON.stringify(users));
}

function showMsg(id, msg, isError = true) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.remove('hidden');
  if (!isError) el.style.display = 'block';
}

function hideMsg(id) {
  document.getElementById(id).classList.add('hidden');
}

// LOGIN
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  hideMsg('loginError');
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === btoa(password));

  if (!user) {
    showMsg('loginError', 'E-mail ou senha incorretos.');
    return;
  }

  localStorage.setItem('sf_current_user', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  window.location.href = 'pages/dashboard.html';
});

// REGISTER
document.getElementById('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  hideMsg('registerError');
  hideMsg('registerSuccess');

  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  if (password.length < 6) {
    showMsg('registerError', 'A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    showMsg('registerError', 'Este e-mail já está cadastrado.');
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: btoa(password),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // Seed default subjects
  const defaultSubjects = [
    { id: 's1', name: 'Primeiros passos', color: '#5B8AF0', userId: newUser.id }
  ];
  const subjects = JSON.parse(localStorage.getItem('sf_subjects') || '[]');
  localStorage.setItem('sf_subjects', JSON.stringify([...subjects, ...defaultSubjects]));

  const tutorialTask = {
    id: 't1',
    userId: newUser.id,
    title: 'Crie sua primeira tarefa ✨',
    desc: 'Use o botão + para adicionar tarefas e organizar seus estudos.',
    subjectId: 's1',
    priority: 'medium',
    due: '',
    done: false
  };

  const tasks = JSON.parse(localStorage.getItem('sf_tasks') || '[]');

  localStorage.setItem(
    'sf_tasks',
    JSON.stringify([...tasks, tutorialTask])
  );


  showMsg('registerSuccess', 'Conta criada! Faça login para continuar.', false);
  document.getElementById('registerForm').reset();

  setTimeout(() => {
    tabs[0].click();
    document.getElementById('loginEmail').value = email;
  }, 1500);
});

// Redirect if already logged in
if (localStorage.getItem('sf_current_user')) {
  window.location.href = 'pages/dashboard.html';
}
