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
