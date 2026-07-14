(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  // Add a compact shadowed header only after the visitor begins scrolling.
  const header = document.querySelector('.het-site-header');
  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  // Close the mobile menu after a destination is selected.
  document.querySelectorAll('.het-mobile-menu nav a').forEach((link) => {
    link.addEventListener('click', () => link.closest('details')?.removeAttribute('open'));
  });

  // Stagger related cards so groups arrive in a calm sequence instead of all at once.
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    [...group.children].forEach((child, index) => {
      if (child.classList.contains('reveal')) {
        child.style.setProperty('--reveal-delay', `${Math.min(index * 105, 420)}ms`);
      }
    });
  });

  const items = [...document.querySelectorAll('.reveal')];
  if (items.length && !reduceMotion && 'IntersectionObserver' in window) {
    document.body.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    items.forEach((item) => observer.observe(item));
  }

  // Very light pointer parallax for the desktop hero. It resets when the pointer leaves.
  const visual = document.querySelector('.het-hero-visual');
  if (visual && !reduceMotion && window.matchMedia('(min-width: 961px)').matches) {
    let frame = 0;
    const setPosition = (x, y) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        visual.style.setProperty('--het-parallax-x', x.toFixed(3));
        visual.style.setProperty('--het-parallax-y', y.toFixed(3));
      });
    };
    visual.addEventListener('pointermove', (event) => {
      const rect = visual.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      setPosition(x, y);
    }, { passive: true });
    visual.addEventListener('pointerleave', () => setPosition(0, 0), { passive: true });
  }
})();
