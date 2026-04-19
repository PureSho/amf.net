'use strict';

/* =======================
   CONFIG
======================= */
const SHEET_ID = '13j-KZkcX5YGl9erGQFgL9D44xs0HeLL6kG3dM4igmfo';
const SHEET_NAME = 'SURGE Roster';
const PAGE_SIZE = 10;

const SHEET_COLUMNS = [
  { header: 'Members', colLetter: 'A' },
  { header: 'Role(s)', colLetter: 'B' },
  { header: 'Status', colLetter: 'C' },
  { header: 'Gender', colLetter: 'D' }
];

// extra columns
const AVATAR_COL = 'E';
const SOCIAL_COLS = {
  tiktok: 'F',
  twitch: 'G',
  youtube: 'H'
};
const STATS_COL = 'K';

/* =======================
   DOM REFERENCES
======================= */
const sheetWrapper = document.getElementById('sheetWrapper');
const sheetStatus = document.getElementById('sheetStatus');
const paginationEl = document.getElementById('pagination');

const playerModal = document.getElementById('playerModal');
const playerAvatar = document.getElementById('playerAvatar');
const playerNameEl = document.getElementById('playerName');
const playerRoleEl = document.getElementById('playerRole');
const playerStatusEl = document.getElementById('playerStatus');
const playerGenderEl = document.getElementById('playerGender');
const playerSocialEl = document.getElementById('playerSocial');
const playerStatsBtn = document.getElementById('playerStatsBtn');

/* =======================
   HELPERS
======================= */
function colLetterToIdx(letter) {
  let idx = 0;
  letter = String(letter).toUpperCase();
  for (let i = 0; i < letter.length; i++) {
    idx = idx * 26 + (letter.charCodeAt(i) - 64);
  }
  return idx - 1;
}

function extractImgSrc(value) {
  if (!value) return null;
  const str = String(value).trim();
  const m = str.match(/<img[^>]*src=["']?([^"'\s>]+)["']?/i);
  if (m) return m[1];
  if (/^https?:\/\//i.test(str)) return str;
  return null;
}

function extractUrl(value) {
  if (!value) return null;
  const str = String(value).trim();
  if (/^https?:\/\//i.test(str)) return str;
  return null;
}

/* =======================
   FETCH SHEET
======================= */
function fetchSheet() {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?` +
    `sheet=${encodeURIComponent(SHEET_NAME)}&tq=${encodeURIComponent('select *')}`;

  return fetch(url)
    .then(r => r.text())
    .then(txt => {
      const json = JSON.parse(
        txt.match(/google\.visualization\.Query\.setResponse\((.*)\)/)[1]
      );
      return normalizeRows(json.table);
    });
}

function normalizeRows(table) {
  const maxCol = Math.max(
    ...SHEET_COLUMNS.map(c => colLetterToIdx(c.colLetter)),
    colLetterToIdx(AVATAR_COL),
    colLetterToIdx(STATS_COL),
    ...Object.values(SOCIAL_COLS).map(colLetterToIdx)
  );

  return (table.rows || []).map(r => {
    const row = [];
    for (let i = 0; i <= maxCol; i++) {
      const cell = r.c?.[i];
      row[i] = cell?.f ?? cell?.v ?? '';
    }
    return row;
  });
}

/* =======================
   STATE
======================= */
let sheetRows = [];
let currentPage = 1;

/* =======================
   RENDER TABLE
======================= */
function renderTable() {
  if (!sheetRows.length) {
    sheetWrapper.innerHTML = '<div class="sheet-error">No roster data</div>';
    return;
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = sheetRows.slice(start, start + PAGE_SIZE);

  const avatarIdx = colLetterToIdx(AVATAR_COL);
  const colIdxs = SHEET_COLUMNS.map(c => colLetterToIdx(c.colLetter));

  const table = document.createElement('table');
  table.className = 'live-table';

  // header
  const thead = document.createElement('thead');
  const hr = document.createElement('tr');
  SHEET_COLUMNS.forEach(c => {
    const th = document.createElement('th');
    th.textContent = c.header;
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  // body
  const tbody = document.createElement('tbody');

  pageRows.forEach((row, i) => {
    const tr = document.createElement('tr');

    colIdxs.forEach((idx, colPos) => {
      const td = document.createElement('td');

      if (colPos === 0) {
        const btn = document.createElement('button');
        btn.className = 'player-link';
        btn.type = 'button';
        btn.dataset.row = start + i;

        const avatarUrl = extractImgSrc(row[avatarIdx]);
        if (avatarUrl) {
          const img = document.createElement('img');
          img.src = avatarUrl;
          img.className = 'player-thumb';
          img.loading = 'lazy';
          img.onerror = () => img.remove();
          btn.appendChild(img);
        }

        const span = document.createElement('span');
        span.textContent = row[idx] || '—';
        btn.appendChild(span);

        btn.onclick = () => openPlayerCard(Number(btn.dataset.row));
        td.appendChild(btn);
      } else {
        td.textContent = row[idx] || '';
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  sheetWrapper.innerHTML = '';
  sheetWrapper.appendChild(table);

  renderPagination();
}

/* =======================
   PAGINATION
======================= */
function renderPagination() {
  const totalPages = Math.ceil(sheetRows.length / PAGE_SIZE);
  paginationEl.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => {
      currentPage = i;
      renderTable();
    };
    paginationEl.appendChild(btn);
  }

  sheetStatus.textContent =
    `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
      sheetRows.length,
      currentPage * PAGE_SIZE
    )} of ${sheetRows.length}`;
}

/* =======================
   PLAYER MODAL
======================= */
function openPlayerCard(index) {
  const row = sheetRows[index];
  if (!row) return;

  const idx = l => colLetterToIdx(l);

  const name = row[idx('A')] || 'Unknown';

  playerNameEl.textContent = name;
  playerRoleEl.textContent = row[idx('B')] ? `Role: ${row[idx('B')]}` : '';
  playerStatusEl.textContent = row[idx('C')] ? `Status: ${row[idx('C')]}` : '';
  playerGenderEl.textContent = row[idx('D')] ? `Gender: ${row[idx('D')]}` : '';

  // avatar
  playerAvatar.innerHTML = '';
  const avatarUrl = extractImgSrc(row[idx(AVATAR_COL)]);
  if (avatarUrl) {
    const img = document.createElement('img');
    img.src = avatarUrl;
    img.className = 'player-avatar-img';
    img.onerror = () => (playerAvatar.textContent = name[0]);
    playerAvatar.appendChild(img);
  } else {
    playerAvatar.textContent = name[0];
  }

  // socials
  playerSocialEl.innerHTML = '';
  Object.entries(SOCIAL_COLS).forEach(([key, col]) => {
    const url = extractUrl(row[idx(col)]);
    if (!url) return;

    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'social-link';
    a.title = key;

    a.innerHTML = {
      tiktok: '🎵',
      twitch: '🎮',
      youtube: '▶️'
    }[key];

    playerSocialEl.appendChild(a);
  });

  // stats button
  playerStatsBtn.innerHTML = '';
  const statsUrl = extractUrl(row[idx(STATS_COL)]);
  if (statsUrl) {
    const a = document.createElement('a');
    a.href = statsUrl;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'View Stats';
    a.className = 'player-link';
    playerStatsBtn.appendChild(a);
  }

  playerModal.setAttribute('aria-hidden', 'false');
}

/* =======================
   MODAL CLOSE
======================= */
playerModal.addEventListener('click', e => {
  if (e.target.dataset.action === 'close') {
    playerModal.setAttribute('aria-hidden', 'true');
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    playerModal.setAttribute('aria-hidden', 'true');
  }
});

/* =======================
   INIT
======================= */
fetchSheet()
  .then(rows => {
    sheetRows = rows.filter(r => r.some(v => v));
    renderTable();
  })
  .catch(err => {
    console.error(err);
    sheetStatus.textContent = 'Failed to load roster';
  });
  /* ---------- Mobile menu toggle (no persistent inline styling leak) ---------- */
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) {
        // Apply only necessary inline styles for the mobile menu to appear (temporary)
        mainNav.dataset._wasHidden = getComputedStyle(mainNav).display === 'none' ? 'true' : '';
        mainNav.style.display = 'flex';
        mainNav.style.flexDirection = 'column';
        mainNav.style.gap = '12px';
        mainNav.style.position = 'absolute';
        mainNav.style.right = '16px';
        mainNav.style.top = '66px';
        mainNav.style.background = 'rgba(6,10,20,0.7)';
        mainNav.style.padding = '12px';
        mainNav.style.borderRadius = '10px';
        mainNav.style.zIndex = '9999';
      } else {
        // Revert inline styles
        ['display','flexDirection','gap','position','right','top','background','padding','borderRadius','zIndex'].forEach(k => mainNav.style[k] = '');
        if (mainNav.dataset._wasHidden) { mainNav.style.display = ''; delete mainNav.dataset._wasHidden; }
      }
    });
  }

// NAV BAR
menuBtn.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!expanded));
  if (!expanded) {
    // Open mobile menu: set mobile styles
    mainNav.style.display = 'flex';
    mainNav.style.flexDirection = 'column';
    mainNav.style.gap = '12px';
    mainNav.style.position = 'absolute';
    mainNav.style.right = '20px';
    mainNav.style.top = '66px';
    mainNav.style.background = 'rgba(6,10,20,0.6)';
    mainNav.style.padding = '12px';
    mainNav.style.borderRadius = '10px';
    mainNav.style.zIndex = '99';
  } else {
    // CLOSE: remove ALL inline styles set above
    mainNav.style.display = '';
    mainNav.style.flexDirection = '';
    mainNav.style.gap = '';
    mainNav.style.position = '';
    mainNav.style.right = '';
    mainNav.style.top = '';
    mainNav.style.background = '';
    mainNav.style.padding = '';
    mainNav.style.borderRadius = '';
    mainNav.style.zIndex = '';
  }
});
// small enhancement: smooth-link navigation offset for header
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener('click',(e)=>{
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target){
      e.preventDefault();
      const headerOffset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({top, behavior:'smooth'});
      // close mobile nav if open
      if(menuBtn.getAttribute('aria-expanded') === 'true'){ menuBtn.click(); }
    }
  });
});
