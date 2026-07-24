// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Typewriter effect for the nav brand role (deepa@sre -> deepa@devops -> ...)
const roleEl = document.getElementById('roleType');
if (roleEl) {
  const roles = ['sre', 'devops', 'platform engineer'];
  const TYPE_SPEED = 90;
  const DELETE_SPEED = 50;
  const HOLD_TIME = 1600;
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  // Respect reduced-motion preference: just cycle the text without animating characters
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function tick() {
    const current = roles[roleIndex];

    if (prefersReducedMotion) {
      roleEl.textContent = current;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(tick, 2200);
      return;
    }

    if (!deleting) {
      charIndex++;
      roleEl.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        deleting = true;
        setTimeout(tick, HOLD_TIME);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      roleEl.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  setTimeout(tick, HOLD_TIME);
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navlinks = document.getElementById('navlinks');
navToggle.addEventListener('click', () => {
  const isOpen = navlinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navlinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navlinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll reveal for sections
const revealTargets = document.querySelectorAll(
  '.about-grid, .stack-card, .timeline-item, .project-card, .cert-card, .contact-card'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => io.observe(el));

// Animated stat counters in hero panel
const statEls = document.querySelectorAll('.stat-num');
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;
  statEls.forEach(el => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = target % 1 !== 0;
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(2) : Math.round(value);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

const heroPanel = document.querySelector('.hero-panel');
if (heroPanel) {
  const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        panelObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  panelObserver.observe(heroPanel);
}