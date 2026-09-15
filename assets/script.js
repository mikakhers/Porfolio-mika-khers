document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Animated stat counters ---------- */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length) {
    const animateCount = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const duration = 1000;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statNums.forEach(el => statObserver.observe(el));
  }

  /* ---------- Skill bars (mini, accueil) ---------- */
  const bars = document.querySelectorAll('.skill-bar-fill[data-pct]');
  if (bars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pct = entry.target.getAttribute('data-pct');
          entry.target.style.width = pct + '%';
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(el => barObserver.observe(el));
  }

  /* ---------- Skill rings (page competences) ---------- */
  const rings = document.querySelectorAll('.ring-progress[data-pct]');
  if (rings.length) {
    const CIRC = 345; // 2 * PI * r(55)
    const ringObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pct = parseFloat(entry.target.getAttribute('data-pct')) || 0;
          const offset = CIRC - (pct / 100) * CIRC;
          entry.target.style.strokeDashoffset = offset;
          const numEl = entry.target.closest('.ring-card')?.querySelector('.ring-num');
          if (numEl) {
            const start = performance.now();
            const duration = 1400;
            const step = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              numEl.textContent = Math.round(progress * pct) + '%';
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
          ringObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    rings.forEach(el => ringObserver.observe(el));
  }

  /* ---------- Typewriter effect (hero, accueil) ---------- */
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    let phrases = [];
    try {
      phrases = JSON.parse(typedEl.getAttribute('data-phrases') || '[]');
    } catch (e) { phrases = []; }
    if (phrases.length) {
      let phraseIndex = 0, charIndex = 0, deleting = false;
      const typeSpeed = 55, deleteSpeed = 30, pause = 1600;

      const tick = () => {
        const current = phrases[phraseIndex];
        if (!deleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, pause);
            return;
          }
          setTimeout(tick, typeSpeed);
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(tick, 300);
            return;
          }
          setTimeout(tick, deleteSpeed);
        }
      };
      tick();
    }
  }

});
