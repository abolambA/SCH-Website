/**
 * SpeedCubeHub Global Theme JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initProductCardTilt();
});

// 3. Scroll Reveal (IntersectionObserver)
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el, index) => {
    // Add staggering delay based on index for grid items
    if (el.closest('.grid')) {
      el.style.transitionDelay = `${(index % 4) * 60}ms`;
    }
    revealObserver.observe(el);
  });
}

// 4. Product Card 3D Tilt
function initProductCardTilt() {
  const cards = document.querySelectorAll('.product-card.tilt-enabled');

  cards.forEach(card => {
    const cardInner = card.querySelector('.product-card__inner');
    if (!cardInner) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8; // Max 8 deg
      const rotateY = ((x - centerX) / centerX) * 8;  // Max 8 deg

      cardInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      cardInner.style.boxShadow = `0 20px 40px rgba(255,208,0,0.15), 0 0 15px rgba(255,208,0,0.3)`;
    });

    card.addEventListener('mouseleave', () => {
      cardInner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
      cardInner.style.boxShadow = 'none';
    });
  });
}

// 5. Search Component
let searchTimeout;
function openSearch() {
  const dialog = document.getElementById('searchDialog');
  if (dialog) dialog.classList.add('open');
  const input = document.getElementById('searchInput');
  if (input) input.focus();
  document.body.style.overflow = 'hidden';
}
function closeSearch() {
  const dialog = document.getElementById('searchDialog');
  if (dialog) dialog.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });
function handleSearch(query) {
  clearTimeout(searchTimeout);
  if (query.length < 2) {
    const res = document.getElementById('searchResults');
    if (res) res.innerHTML = '';
    return;
  }
  searchTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=8`);
      const data = await res.json();
      const products = data.resources.results.products;
      const html = products.map(p => `
        <a href="${p.url}" class="search-result-card">
          <img src="${p.featured_image?.url || ''}" class="search-result-img" alt="${p.title}">
          <div>
            <div class="search-result-name">${p.title}</div>
            <div class="search-result-price">${p.price}</div>
          </div>
        </a>`).join('');
      const resultsEl = document.getElementById('searchResults');
      if (resultsEl) resultsEl.innerHTML = html || '<p style="color:#8899AA;padding:16px;text-align:center">No results found</p>';
      const viewAll = document.getElementById('viewAllSearch');
      if (viewAll) {
        viewAll.style.display = products.length ? 'block' : 'none';
        viewAll.href = `/search?q=${encodeURIComponent(query)}`;
      }
    } catch (e) {
      console.error(e);
    }
  }, 300);
}

// Hook up search toggle & Scroll to top
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.search-toggle, [data-search-toggle], a[href="/search"]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openSearch(); });
  });

  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    });
  }

  // Init Banner Carousel
  if (document.querySelector('.banner-carousel')) {
    resetBannerTimer();
    const prevBtn = document.querySelector('.banner-prev');
    const nextBtn = document.querySelector('.banner-next');
    if (prevBtn) prevBtn.addEventListener('click', bannerPrev);
    if (nextBtn) nextBtn.addEventListener('click', bannerNext);
    bannerDots.forEach((dot, i) => dot.addEventListener('click', () => { bannerGo(i); resetBannerTimer(); }));
  }
});

// Banner Carousel Logic
let bannerIdx = 0;
const bannerSlides = document.querySelectorAll('.banner-slide');
const bannerDots = document.querySelectorAll('.banner-dot');
let bannerTimer;
function bannerGo(n) {
  if (!bannerSlides.length) return;
  bannerSlides[bannerIdx].classList.remove('active');
  if (bannerDots[bannerIdx]) bannerDots[bannerIdx].classList.remove('active');
  bannerIdx = (n + bannerSlides.length) % bannerSlides.length;
  bannerSlides[bannerIdx].classList.add('active');
  if (bannerDots[bannerIdx]) bannerDots[bannerIdx].classList.add('active');
}
function bannerNext() { bannerGo(bannerIdx + 1); resetBannerTimer(); }
function bannerPrev() { bannerGo(bannerIdx - 1); resetBannerTimer(); }
function resetBannerTimer() {
  clearInterval(bannerTimer);
  const speed = parseInt(document.querySelector('.banner-carousel')?.dataset.speed || 4000);
  bannerTimer = setInterval(() => bannerNext(), speed);
}
