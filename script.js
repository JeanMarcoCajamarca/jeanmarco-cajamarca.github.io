'use strict';

// ─── BOOT SEQUENCE ───────────────────────────────────────────────
const bootLines = [
  'BIOS v1.00 /// CAJAMARCA SYSTEMS INC.',
  'Initializing memory banks......... OK',
  'Loading core modules.............. OK',
  'Mounting filesystem............... OK',
  'Starting portfolio design......... OK',
  'Establishing link................. OK',
  '',
  '>>> WELCOME, VISITOR! ACCESS GRANTED!',
  '>>> SYSTEM READY. STAND BY...',
];

function runBootSequence() {
  const bootScreen = document.getElementById('boot-screen');
  const bootText = document.getElementById('boot-text');

  if (!bootScreen || !bootText) return;

  // Skip boot if already seen in session
  if (sessionStorage.getItem('booted')) {
    bootScreen.classList.add('hidden');
    setTimeout(() => { bootScreen.style.display = 'none'; }, 500);
    return;
  }

  let lineIdx = 0;
  let charIdx = 0;
  let current = '';
  const lines = [];

  function typeLine() {
    if (lineIdx >= bootLines.length) {
      sessionStorage.setItem('booted', '1');
      setTimeout(() => {
        bootScreen.style.transition = 'opacity 0.5s ease';
        bootScreen.classList.add('hidden');
        setTimeout(() => { bootScreen.style.display = 'none'; }, 600);
      }, 600);
      return;
    }

    const line = bootLines[lineIdx];

    if (charIdx < line.length) {
      current += line[charIdx];
      charIdx++;
      bootText.textContent = [...lines, current].join('\n');
      setTimeout(typeLine, line.startsWith('>>>') ? 30 : 18);
    } else {
      lines.push(current);
      current = '';
      charIdx = 0;
      lineIdx++;
      bootText.textContent = lines.join('\n');
      setTimeout(typeLine, lineIdx === bootLines.length ? 0 : 120);
    }
  }

  typeLine();
}


// ─── TYPEWRITER — HERO TAGLINE ───────────────────────────────────
const taglines = [
  'Author',
  'Economist',
  'Twitch Streamer',
  'Tech Specialist',
  'Creative Game Developer',
  'Building Art For Gamers',
];

function initTypewriter() {
  const el = document.getElementById('hero-tagline');
  if (!el) return;

  let tagIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function tick() {
    const text = taglines[tagIdx];

    if (!deleting) {
      el.textContent = text.slice(0, charIdx + 1) + '█';
      charIdx++;
      if (charIdx === text.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; requestAnimationFrame(tick); }, 2200);
        return;
      }
    } else {
      el.textContent = text.slice(0, charIdx) + '█';
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        tagIdx = (tagIdx + 1) % taglines.length;
        charIdx = 0;
      }
    }

    if (!pause) {
      setTimeout(tick, deleting ? 40 : 65);
    }
  }

  tick();
}


// ─── TERMINAL SKILL OUTPUT ───────────────────────────────────────
const terminalSkills = [
  'SQL + JavaScript + CSS + HTML',
  'Game Development (Indie)',
];

function initTerminalSkills() {
  const el = document.getElementById('skills-output');
  if (!el) return;

  terminalSkills.forEach((skill, i) => {
    setTimeout(() => {
      const p = document.createElement('p');
      p.textContent = `  → ${skill}`;
      p.style.opacity = '0';
      p.style.transition = 'opacity 0.4s';
      el.appendChild(p);
      requestAnimationFrame(() => { p.style.opacity = '1'; });
    }, i * 300);
  });
}


// ─── SKILLS BARS ─────────────────────────────────────────────────
const skills = [
  { name: 'Business & Economics'},
  { name: 'Data Analytics / SQL'},
  { name: 'Web Development'},
  { name: 'Game Development'},
  { name: 'Project Management'},
];

function buildSkillBars() {
  const container = document.getElementById('skills-bars');
  if (!container) return;

  skills.forEach(({ name, pct }) => {
    const item = document.createElement('div');
    item.className = 'skill-bar-item';
    item.innerHTML = `
      <div class="skill-bar-header">
        <span class="skill-bar-name">${name}</span>
        <span class="skill-bar-pct">${pct}%</span>
      </div>
      <div class="skill-track">
        <div class="skill-fill" data-pct="${pct}"></div>
      </div>
    `;
    container.appendChild(item);
  });
}

function animateSkillBars(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        const pct = fill.getAttribute('data-pct');
        setTimeout(() => { fill.style.width = pct + '%'; }, 150);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}

let skillObserver;
function initSkillBars() {
  buildSkillBars();
  skillObserver = new IntersectionObserver(animateSkillBars, { threshold: 0.3 });
  const barsContainer = document.getElementById('skills-bars');
  if (barsContainer) skillObserver.observe(barsContainer.parentElement);
}


// ─── FADE-IN ON SCROLL ───────────────────────────────────────────
function initFadeIns() {
  const targets = document.querySelectorAll(
    '.project-card, .blog-card, .about-specs, .about-skills-panel, .resume-panel, .contact-method, .contact-form'
  );

  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}


// ─── NAVBAR SCROLL BEHAVIOR ──────────────────────────────────────
function initNavbar() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
}


// ─── ACTIVE NAV HIGHLIGHTING ─────────────────────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}


// ─── CONTACT FORM ────────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = '// ERROR: All fields required.';
      status.className = 'form-status error';
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      status.textContent = '// ERROR: Invalid email address.';
      status.className = 'form-status error';
      return;
    }

    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = 'TRANSMITTING...';
    status.textContent = '';
    status.className = 'form-status';

    // Simulated async send — replace with real endpoint (e.g. Formspree)
    await new Promise(r => setTimeout(r, 1400));

    // Success state
    status.textContent = '// TRANSMISSION SUCCESSFUL. Message received.';
    status.className = 'form-status success';
    btn.textContent = 'SENT ✓';
    btn.style.background = 'var(--accent-green)';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = 'TRANSMIT MESSAGE';
      btn.style.background = '';
      status.textContent = '';
      status.className = 'form-status';
    }, 4000);
  });

  // Real-time validation feedback
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => {
      if (input.required && !input.value.trim()) {
        input.style.borderColor = 'var(--accent-red)';
      } else {
        input.style.borderColor = '';
      }
    });
    input.addEventListener('focus', () => {
      input.style.borderColor = '';
    });
  });
}


// ─── FOOTER YEAR ─────────────────────────────────────────────────
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = `// ${new Date().getFullYear()}`;
}


// ─── CURSOR GLOW TRAIL ───────────────────────────────────────────
function initCursorTrail() {
  // Only on desktop
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const trail = document.createElement('div');
  trail.id = 'cursor-trail';
  trail.style.cssText = `
    position: fixed;
    width: 6px;
    height: 6px;
    background: rgba(0, 229, 255, 0.7);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9997;
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.5), 0 0 20px rgba(0, 229, 255, 0.2);
    transition: transform 0.1s ease;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(trail);

  let mx = -100, my = -100;
  let cx = -100, cy = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    trail.style.left = cx + 'px';
    trail.style.top = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}


// ─── GLITCH EFFECT ON HERO TITLE ─────────────────────────────────
function initGlitch() {
  const lastName = document.querySelector('.hero-last');
  if (!lastName) return;

  const original = lastName.textContent;
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  function glitch() {
    let iterations = 0;
    const interval = setInterval(() => {
      lastName.textContent = original
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iterations) return original[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iterations >= original.length) {
        clearInterval(interval);
        lastName.textContent = original;
      }
      iterations += 1 / 2;
    }, 30);
  }

  // Trigger glitch on hover
  lastName.style.cursor = 'pointer';
  lastName.addEventListener('mouseenter', glitch);

  // Random occasional glitch
  setInterval(() => {
    if (Math.random() < 0.15) glitch();
  }, 8000);
}


// ─── INIT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  runBootSequence();

  // Delay main init until after boot
  const delay = sessionStorage.getItem('booted') ? 0 : 2800;
  setTimeout(() => {
    initTypewriter();
    initTerminalSkills();
    initSkillBars();
    initFadeIns();
    initNavbar();
    initActiveNav();
    initContactForm();
    setFooterYear();
    initCursorTrail();
    initGlitch();
  }, delay);
});
