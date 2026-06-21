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

function starsHtml(count) {
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

async function loadFlowers() {
  const res = await fetch('data/flowers.json');
  const flowers = await res.json();
  const grid = document.getElementById('flower-grid');
  if (!grid) return;
  grid.innerHTML = flowers.map(f => `
    <div class="content-card">
      <div class="card-tag">${f.tag}</div>
      <h3>${f.name}</h3>
      <p>${f.description}</p>
    </div>
  `).join('');
}

async function loadReviews() {
  const res = await fetch('data/reviews.json');
  const reviews = await res.json();
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;
  grid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="stars">${starsHtml(r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="reviewer">— ${r.reviewer}</div>
    </div>
  `).join('');
}

async function loadHours() {
  const res = await fetch('data/hours.json');
  const hours = await res.json();
  const list = document.getElementById('hours-list');
  if (!list) return;
  list.innerHTML = Object.values(hours).map(h => `
    <div class="hours-row"><span>${h.label}</span><span>${h.open} – ${h.close}</span></div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadFlowers();
  loadReviews();
  loadHours();
});
