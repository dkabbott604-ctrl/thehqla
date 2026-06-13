const PASSWORD = 'thehqla';

document.getElementById('pw-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const val = document.getElementById('pw-input').value.trim().toLowerCase();
  if (val === PASSWORD) {
    document.getElementById('password-screen').style.opacity = '0';
    document.getElementById('password-screen').style.transition = 'opacity 0.6s ease';
    setTimeout(() => {
      document.getElementById('password-screen').classList.add('hidden');
      document.getElementById('main-site').classList.remove('hidden');
    }, 600);
  } else {
    const err = document.getElementById('pw-error');
    err.classList.remove('hidden');
    document.getElementById('pw-input').value = '';
    document.getElementById('pw-input').classList.add('shake');
    setTimeout(() => document.getElementById('pw-input').classList.remove('shake'), 500);
  }
});

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.classList.add('hidden');
  });
  const target = document.getElementById('page-' + id);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}
