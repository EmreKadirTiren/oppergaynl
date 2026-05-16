/* ===== MOOD CONFIG =====
   Update this to change your mood. Format: 'YYYY-MM-DD HH:MM'
   Or just put the date as null to skip the "since" timer.
============================ */
const MOOD = {
  text: 'sleeping',         // <-- change me
  since: '2026-05-16 12:00',          // <-- and me (or set to null)
};

const moodValueEl  = document.getElementById('mood-value');
const moodSinceEl  = document.getElementById('mood-since');
const moodSinceTag = document.getElementById('mood-since-tag');

function relativeTime(fromStr) {
  if (!fromStr) return null;
  const from = new Date(fromStr.replace(' ', 'T'));
  if (isNaN(from)) return null;
  const diff = Math.max(0, Date.now() - from.getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function applyMood() {
  moodValueEl.textContent = MOOD.text;
  const rel = relativeTime(MOOD.since);
  if (rel) {
    moodSinceEl.textContent = `// since ${rel}`;
    moodSinceTag.textContent = rel;
  } else {
    moodSinceEl.textContent = '';
    moodSinceTag.textContent = '';
  }
}
applyMood();
// re-tick every minute so "since 5m ago" updates
setInterval(applyMood, 60_000);

/* ===== EASTER EGG ===== */
const easterCode = 'kluizen';
const easterOverlay = document.getElementById('easter-overlay');
let easterBuffer = '';

window.addEventListener('keydown', (e) => {
  // skip when typing in inputs (futureproof for guestbook etc)
  if (e.target.matches('input, textarea')) return;

  if (e.key === 'Escape') {
    easterOverlay.classList.remove('active');
    return;
  }

  if (e.key.length === 1) {
    easterBuffer = (easterBuffer + e.key.toLowerCase()).slice(-easterCode.length);
    if (easterBuffer === easterCode) {
      easterOverlay.classList.add('active');
      // celebratory beep sequence
      try {
        [659, 784, 988, 1175].forEach((freq, i) => {
          setTimeout(() => beep(freq, 0.12, 'square', 0.04), i * 100);
        });
      } catch (err) { /* sound not loaded yet */ }
      easterBuffer = '';
    }
  }
});

// click outside content to close
easterOverlay.addEventListener('click', (e) => {
  if (e.target === easterOverlay) {
    easterOverlay.classList.remove('active');
  }
});
/* ===== RAIN ===== */
const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d');
let drops = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // recreate drops sized to viewport
  drops = [];
  const count = Math.floor((canvas.width * canvas.height) / 9000);
  for (let i = 0; i < count; i++) {
    drops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      l: 10 + Math.random() * 18,           // length
      vy: 6 + Math.random() * 10,           // fall speed
      a: 0.15 + Math.random() * 0.35,       // alpha
    });
  }
}

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;
  for (const d of drops) {
    const grad = ctx.createLinearGradient(d.x, d.y, d.x + 1, d.y + d.l);
    grad.addColorStop(0, `rgba(255, 45, 146, 0)`);
    grad.addColorStop(0.5, `rgba(166, 77, 255, ${d.a * 0.5})`);
    grad.addColorStop(1, `rgba(0, 229, 255, ${d.a})`);
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + 1, d.y + d.l);
    ctx.stroke();

    d.y += d.vy;
    if (d.y > canvas.height + d.l) {
      d.y = -d.l;
      d.x = Math.random() * canvas.width;
    }
  }
  requestAnimationFrame(drawRain);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawRain();

/* ===== HUD CLOCK + UPTIME ===== */
const hudTime = document.getElementById('hud-time');
const uptimeEl = document.getElementById('uptime');
const startTime = Date.now();

function pad(n) { return String(n).padStart(2, '0'); }

function updateClocks() {
  const now = new Date();
  hudTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  uptimeEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
}

updateClocks();
setInterval(updateClocks, 1000);

/* ===== BOOT SEQUENCE ===== */
const bootLine = document.getElementById('boot-line');
const bootMessages = [
  '> initializing user_terminal_v2.4...',
  '> establishing connection to oppergay.nl',
  '> handshake :: OK',
  '> loading personal_data.bin',
  '> ready_'
];

let bootIdx = 0;
function nextBootLine() {
  if (bootIdx >= bootMessages.length) return;
  bootLine.innerHTML = bootMessages[bootIdx] + '<span class="cursor"></span>';
  bootIdx++;
  if (bootIdx < bootMessages.length) {
    setTimeout(nextBootLine, 600);
  }
}
setTimeout(nextBootLine, 800);

/* ===== OCCASIONAL GLITCH ON H1 ===== */
const h1 = document.querySelector('.hero h1');
function triggerGlitch() {
  h1.classList.add('glitch');
  setTimeout(() => h1.classList.remove('glitch'), 200 + Math.random() * 200);
  // schedule next glitch (random 4-12s)
  setTimeout(triggerGlitch, 4000 + Math.random() * 8000);
}
setTimeout(triggerGlitch, 3000);

// glitch on hover too
h1.addEventListener('mouseenter', () => h1.classList.add('glitch'));
h1.addEventListener('mouseleave', () => h1.classList.remove('glitch'));

/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let dotX = mouseX, dotY = mouseY;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

// dot follows with slight lag
function animateDot() {
  dotX += (mouseX - dotX) * 0.25;
  dotY += (mouseY - dotY) * 0.25;
  cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateDot);
}
animateDot();

// hover state on interactive elements
const hoverables = 'a, button, .project, .portal, .ctrl-btn, .time-indicator, [role="button"]';
document.querySelectorAll(hoverables).forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// re-run binding after dynamic content loads
function bindCursorHovers() {
  document.querySelectorAll(hoverables).forEach(el => {
    if (el._cursorBound) return;
    el._cursorBound = true;
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

/* ===== HOVER SOUNDS (Web Audio API, no files needed) ===== */
let audioCtx = null;
let soundEnabled = true;

function ensureAudioCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      soundEnabled = false;
    }
  }
  return audioCtx;
}

function beep(freq, duration = 0.05, type = 'square', volume = 0.04) {
  if (!soundEnabled) return;
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function bindSounds() {
  document.querySelectorAll(hoverables).forEach(el => {
    if (el._soundBound) return;
    el._soundBound = true;
    el.addEventListener('mouseenter', () => beep(880, 0.04, 'square', 0.025));
    el.addEventListener('click',      () => beep(440, 0.08, 'sawtooth', 0.05));
  });
}

// activate sound on first user interaction (browser autoplay policy)
window.addEventListener('pointerdown', () => ensureAudioCtx(), { once: true });
bindSounds();

/* ===== LAST.FM NOW PLAYING ===== */
const LASTFM_USER = 'dragonhj';
const LASTFM_KEY  = ''; // <-- paste API key here

const npLabel = document.getElementById('np-label');
const npTrack = document.getElementById('np-track');
const npIndicator = document.getElementById('np-indicator');
const npCover = document.getElementById('np-cover');
const npTags = document.getElementById('np-tags');
const npBio = document.getElementById('np-bio');
const recentTracksEl = document.getElementById('recent-tracks');

const LASTFM_BLANK_IMG = '2a96cbd8b46e442fc41c2b86b821562f';
const artistInfoCache = new Map();

function pickImage(images, preferred = 'medium') {
  if (!Array.isArray(images)) return '';
  const m = images.find(i => i.size === preferred);
  const url = m?.['#text'] || images[2]?.['#text'] || '';
  return url && !url.includes(LASTFM_BLANK_IMG) ? url : '';
}

function setCover(url) {
  if (url) {
    npCover.innerHTML = `<img src="${escapeHtml(url)}" alt="" onerror="this.parentElement.innerHTML='<span>[ART]</span>';">`;
  } else {
    npCover.innerHTML = '<span>[ART]</span>';
  }
}

function stripBio(html) {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild || doc.body;

  root.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const text = a.textContent || '';
    if (/last\.fm/i.test(href) || /last\.fm/i.test(text)) {
      a.remove();
      return;
    }
    a.replaceWith(doc.createTextNode(text));
  });

  let txt = (root.textContent || '')
    .replace(/User-contributed text is available under.*$/is, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (txt.length > 240) txt = txt.slice(0, 237).trimEnd() + '...';
  return txt;
}

async function fetchArtistInfo(artist) {
  if (!artist) return null;
  if (artistInfoCache.has(artist)) return artistInfoCache.get(artist);
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${LASTFM_KEY}&format=json&autocorrect=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('artist info ' + res.status);
    const data = await res.json();
    const a = data?.artist;
    if (!a) throw new Error('no artist');
    const info = {
      name: a.name,
      tags: (a.tags?.tag || []).slice(0, 4).map(t => t.name),
      bio: stripBio(a.bio?.summary || a.bio?.content || ''),
      listeners: a.stats?.listeners ? Number(a.stats.listeners) : null,
      playcount: a.stats?.playcount ? Number(a.stats.playcount) : null,
    };
    artistInfoCache.set(artist, info);
    return info;
  } catch (e) {
    artistInfoCache.set(artist, null);
    return null;
  }
}

function renderArtistInfo(info) {
  if (!info) {
    npTags.innerHTML = '';
    npBio.classList.remove('visible');
    npBio.innerHTML = '';
    return;
  }
  npTags.innerHTML = info.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
  if (info.bio) {
    const stats = (info.listeners || info.playcount)
      ? `<span class="stats">// listeners <span class="num">${(info.listeners || 0).toLocaleString()}</span> · plays <span class="num">${(info.playcount || 0).toLocaleString()}</span></span>`
      : '';
    npBio.innerHTML = escapeHtml(info.bio) + stats;
    npBio.classList.add('visible');
  } else {
    npBio.classList.remove('visible');
    npBio.innerHTML = '';
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function renderRecent(tracks) {
  if (!tracks.length) {
    recentTracksEl.innerHTML = '<div class="fav placeholder">[ no recent tracks ]</div>';
    return;
  }
  recentTracksEl.innerHTML = tracks.map(t => {
    const name = escapeHtml(t.name || '?');
    const artist = escapeHtml(t.artist?.['#text'] || t.artist?.name || '?');
    const img = t.image?.find(i => i.size === 'medium')?.['#text']
             || t.image?.[2]?.['#text']
             || '';
    const href = t.url || '#';
    const cover = img
      ? `<img src="${escapeHtml(img)}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='[ART]';">`
      : '[ART]';
    return `
      <a class="fav proj-link" href="${escapeHtml(href)}" target="_blank" rel="noopener" style="text-decoration: none; color: inherit;">
        <div class="cover">${cover}</div>
        <div class="info">
          <strong>${name}</strong>
          <span class="artist">${artist}</span>
        </div>
      </a>`;
  }).join('');
  bindCursorHovers();
  bindSounds();
}

let currentArtistKey = null;

async function fetchLastFm() {
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&limit=5`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('lastfm api ' + res.status);
    const data = await res.json();
    const tracks = data?.recenttracks?.track || [];
    const current = tracks[0];

    if (!current) {
      npLabel.textContent = 'NO_DATA';
      npTrack.textContent = '[ silent · no signal ]';
      npTrack.classList.add('placeholder');
      npIndicator.style.opacity = '0.25';
      setCover('');
      renderArtistInfo(null);
      currentArtistKey = null;
      renderRecent([]);
      return;
    }

    const nowPlaying = current['@attr']?.nowplaying === 'true';
    const name = current.name || '?';
    const artist = current.artist?.['#text'] || current.artist?.name || '?';
    npLabel.textContent = nowPlaying ? 'NOW_PLAYING' : 'LAST_PLAYED';
    npTrack.textContent = `${name} · ${artist}`;
    npTrack.classList.remove('placeholder');
    npIndicator.style.opacity = nowPlaying ? '1' : '0.35';

    setCover(pickImage(current.image, 'large'));

    if (artist && artist !== currentArtistKey) {
      currentArtistKey = artist;
      const info = await fetchArtistInfo(artist);
      if (currentArtistKey === artist) renderArtistInfo(info);
    }

    const recent = nowPlaying ? tracks.slice(1, 5) : tracks.slice(0, 4);
    renderRecent(recent);
  } catch (e) {
    npLabel.textContent = 'OFFLINE';
    npTrack.textContent = '[ no signal ]';
    npTrack.classList.add('placeholder');
    npIndicator.style.opacity = '0.25';
    setCover('');
    renderArtistInfo(null);
    currentArtistKey = null;
    recentTracksEl.innerHTML = '<div class="fav placeholder">[ offline ]</div>';
  }
}

fetchLastFm();
setInterval(fetchLastFm, 30_000);

/* ===== STAMPS =====
   88x31 buttons. Paste URLs below. Each entry:
   { img: 'image url', href: 'link target', title: 'tooltip' }
   `href` is optional — omit for non-clickable stamps.
============================================================== */
const STAMPS = [
  // { img: 'https://example.com/button.gif', href: 'https://example.com/', title: 'example' },
];

const stampsGrid = document.getElementById('stamps-grid');
function renderStamps() {
  if (!STAMPS.length) {
    stampsGrid.innerHTML = '<span class="placeholder">[ no stamps yet ]</span>';
    return;
  }
  stampsGrid.innerHTML = STAMPS.map(s => {
    const img = escapeHtml(s.img || '');
    const href = s.href ? escapeHtml(s.href) : '';
    const title = escapeHtml(s.title || '');
    const inner = `<img src="${img}" alt="${title}" title="${title}" loading="lazy" onerror="this.parentElement.classList.add('broken'); this.replaceWith(document.createTextNode('[BROKEN]'));">`;
    return href
      ? `<a class="stamp" href="${href}" target="_blank" rel="noopener" title="${title}">${inner}</a>`
      : `<span class="stamp" title="${title}">${inner}</span>`;
  }).join('');
  bindCursorHovers();
  bindSounds();
}
renderStamps();

/* ===== HIT COUNTER (using counterapi.dev — free, no signup) ===== */
const hitCountEl = document.getElementById('hit-count');
async function loadHitCount() {
  try {
    const res = await fetch('https://api.counterapi.dev/v2/oppergay/visits/up');
    if (!res.ok) throw new Error('counter api down');
    const data = await res.json();
    const n = data?.data?.up_count ?? data?.up_count ?? data?.count ?? null;
    if (n !== null) {
      hitCountEl.textContent = String(n).padStart(6, '0');
    } else {
      hitCountEl.textContent = '------';
    }
  } catch (e) {
    hitCountEl.textContent = '------';
  }
}
loadHitCount();
