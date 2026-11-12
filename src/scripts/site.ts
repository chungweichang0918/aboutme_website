const read = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
const remember = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch { /* storage is optional */ } };
const theme = document.querySelector<HTMLSelectElement>('[data-theme-control]');
if (theme) {
  theme.value = document.documentElement.dataset.theme ?? 'system';
  theme.addEventListener('change', () => {
    if (theme.value === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme.value;
    remember('appearance', theme.value);
  });
}
for (const link of document.querySelectorAll<HTMLElement>('[data-language]')) {
  link.addEventListener('click', () => remember('language', link.dataset.language ?? 'zh-tw'));
}
const language = read('language');
const choices = document.querySelector('.locale-menu .menu-panel');
const preferred = [...(choices?.querySelectorAll<HTMLElement>('[data-language]') ?? [])].find((link) => link.dataset.language === language);
if (choices && preferred) choices.prepend(preferred);

const menus = [...document.querySelectorAll<HTMLDetailsElement>('.dropdown')];
for (const menu of menus) {
  menu.addEventListener('toggle', () => {
    if (menu.open) for (const other of menus) if (other !== menu) other.open = false;
  });
  menu.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menu.open) return;
    menu.open = false;
    menu.querySelector('summary')?.focus();
  });
}
document.addEventListener('click', (event) => {
  for (const menu of menus) if (event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
});

const sound = document.querySelector<HTMLInputElement>('[data-sound-control]');
let audio: AudioContext | undefined;
if (sound) {
  sound.checked = read('interface-sound') === 'true';
  sound.addEventListener('change', () => remember('interface-sound', String(sound.checked)));
  document.addEventListener('click', (event) => {
    if (!sound.checked || !(event.target instanceof Element) || !event.target.closest('button, .button, summary')) return;
    try {
      audio ??= new AudioContext();
      void audio.resume().catch(() => {});
      const tone = audio.createOscillator();
      const volume = audio.createGain();
      tone.frequency.value = 520;
      volume.gain.setValueAtTime(0.024, audio.currentTime);
      volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.07);
      tone.connect(volume).connect(audio.destination);
      tone.start();
      tone.stop(audio.currentTime + 0.08);
    } catch { /* audio is optional */ }
  });
}

const motion = matchMedia('(prefers-reduced-motion: reduce)');
const heroRole = document.querySelector<HTMLElement>('[data-roles]');
if (heroRole && !motion.matches) {
  const roles: string[] = JSON.parse(heroRole.dataset.roles ?? '[]');
  let index = 0;
  if (roles.length > 1) window.setInterval(() => {
    if (motion.matches || document.hidden) return;
    index = (index + 1) % roles.length;
    heroRole.textContent = roles[index];
    heroRole.animate([{ opacity: .25 }, { opacity: 1 }], { duration: 450 });
  }, 3000);
}
if (!motion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((items) => {
    for (const item of items) if (item.isIntersecting) {
      item.target.classList.add('entered');
      observer.unobserve(item.target);
    }
  }, { threshold: 0.12 });
  for (const section of document.querySelectorAll('[data-enter]')) observer.observe(section);
}

const cursor = document.querySelector<HTMLElement>('.cursor-halo');
if (cursor && matchMedia('(pointer: fine) and (hover: hover)').matches && !motion.matches) {
  window.addEventListener('pointermove', (event) => {
    cursor.style.setProperty('--cursor-x', event.clientX + 'px');
    cursor.style.setProperty('--cursor-y', event.clientY + 'px');
    cursor.classList.toggle('visible', event.target instanceof Element && !!event.target.closest('.hero, .overview-card'));
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('visible'));
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    const button = document.querySelector<HTMLButtonElement>('[data-update]');
    if (!button) return;
    const show = () => { button.hidden = !registration.waiting || !navigator.serviceWorker.controller; };
    show();
    registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', show));
    button.addEventListener('click', () => {
      navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
      registration.waiting?.postMessage('skip-waiting');
    });
  }).catch(() => { /* the website remains usable online */ });
}
