(function () {
  'use strict';

  /* ---------- Safe element refs ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  const typedEl = document.getElementById('typed');
  const yearEl = document.getElementById('year');
  const bgVideo = document.getElementById('bgVideo');
  const canvas = document.getElementById('particleCanvas');
  const sheetStatus = document.getElementById('sheetStatus');
  const sheetWrapper = document.getElementById('sheetWrapper');
  const paginationEl = document.getElementById('pagination');

  /* Set year safely */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Typewriter ---------- */
  (function typewriter() {
    if (!typedEl) return;
    const phrases = ['Welcome to SuRGe', 'Read up on us below!', 'And SuRGe On!'];
    let pIndex = 0, chIndex = 0, deleting = false;
    function tick() {
      const full = phrases[pIndex];
      if (!deleting) {
        chIndex++;
        typedEl.textContent = full.slice(0, chIndex);
        if (chIndex === full.length) {
          deleting = true;
          setTimeout(tick, 1200);
          return;
        }
      } else {
        chIndex--;
        typedEl.textContent = full.slice(0, chIndex);
        if (chIndex === 0) {
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 40 : 80);
    }
    tick();
  })();

  /* ---------- Reveal IntersectionObserver (reused globally) ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  if (reveals.length) reveals.forEach(r => obs.observe(r));

  /* ---------- Background video playback handling (try autoplay muted) ---------- */
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.playsInline = true;
    bgVideo.loop = true;
    bgVideo.autoplay = true;
    bgVideo.setAttribute('aria-hidden', 'true');
  }

  /* ---------- Particle canvas (simple, efficient) ---------- */
  (function particlesModule() {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W = 0, H = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.width = Math.floor(window.innerWidth * dpr);
      H = canvas.height = Math.floor(window.innerHeight * dpr);
      initParticles();
    }

    function initParticles() {
      particles = [];
      const count = Math.min(120, Math.max(20, Math.floor((W * H) / (1200 * 9))));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2.2 + 0.6,
          a: Math.random() * 0.6 + 0.18
        });
      }
    }

    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
      const dpr = window.devicePixelRatio || 1;
      mouse.x = e.clientX * dpr;
      mouse.y = e.clientY * dpr;
    });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
    window.addEventListener('resize', resize, { passive: true });

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, 'rgba(239,68,68,0.0)');
      g.addColorStop(1, 'rgba(239,68,68,0.06)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      for (let p of particles) {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const force = Math.min(120 / (dist * 0.6), 0.8);
          p.vx += (dx / dist) * force * 0.0008;
          p.vy += (dy / dist) * force * 0.0008;
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = `rgba(239,68,68,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // connecting lines (O(n^2) but particle count is limited)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 70) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(239,68,68,${0.08 * (1 - dist / 70)})`;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    // Respect reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      canvas.style.display = 'none';
      if (bgVideo) try { bgVideo.pause(); } catch (e) { /* ignore */ }
      // reveal all immediately
      document.querySelectorAll('.reveal').forEach(r => r.classList.add('visible'));
      return;
    }
    resize();
    if (bgVideo) { try { bgVideo.play().catch(() => {}); } catch (e) {} }
    requestAnimationFrame(draw);
  })();

  /* ---------- Smooth anchor scroll (header offset) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
        // close mobile nav if open
        if (menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') menuBtn.click();
      }
    });
  });

  /* ---------- Remove legacy side-arrow element if present ---------- */
  (function removeSideArrow() {
    const side = document.querySelector('.side-arrow');
    if (side && side.parentNode) side.parentNode.removeChild(side);
  })();

  /* ---------- Google Sheets roster (gviz) ---------- */
  // CONFIG - replace SHEET_ID with your spreadsheet id if desired
  const SHEET_ID = '13j-KZkcX5YGl9erGQFgL9D44xs0HeLL6kG3dM4igmfo';
  const SHEET_NAME = 'SURGE Roster';
  const POLL_INTERVAL = 30000;
  const PAGE_SIZE = 10;
  const SHEET_COLUMNS = [
    { header: "Members", colLetter: "A" },
    { header: "Role(s)", colLetter: "B" },
    { header: "Status", colLetter: "C" },
    { header: "Gender", colLetter: "D" }
  ];

  function colLetterToIdx(letter) {
    letter = (letter || '').toUpperCase();
    let idx = 0;
    for (let i = 0; i < letter.length; i++) {
      idx *= 26;
      idx += letter.charCodeAt(i) - 65 + 1;
    }
    return idx - 1;
  }

  function normalizeTable(table) {
    const MAX_COL = Math.max(...SHEET_COLUMNS.map(c => colLetterToIdx(c.colLetter)));
    return (table.rows || []).map(row => {
      const out = [];
      for (let i = 0; i <= MAX_COL; i++) {
        const cell = (row.c && row.c[i]) || null;
        if (cell && cell.f !== undefined && cell.f !== null) out[i] = String(cell.f);
        else if (cell && cell.v !== undefined && cell.v !== null) out[i] = String(cell.v);
        else out[i] = '';
      }
      return out;
    });
  }

  let sheetRows = [], currentPage = 1;

  function renderFixedSheetTable() {
    if (!sheetWrapper) return;
    if (!sheetRows.length) {
      sheetWrapper.innerHTML = '<div class="sheet-error">No data to display</div>';
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }
    const colIndices = SHEET_COLUMNS.map(c => colLetterToIdx(c.colLetter));
    const totalRows = sheetRows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageRows = sheetRows.slice(start, start + PAGE_SIZE);

    const table = document.createElement('table');
    table.className = 'live-table';
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    SHEET_COLUMNS.forEach(col => {
      const th = document.createElement('th'); th.textContent = col.header; trHead.appendChild(th);
    });
    thead.appendChild(trHead); table.appendChild(thead);

    const tbody = document.createElement('tbody');
    pageRows.forEach(row => {
      const tr = document.createElement('tr');
      colIndices.forEach(idx => {
        const td = document.createElement('td'); td.textContent = row[idx] ?? ''; tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    sheetWrapper.innerHTML = ''; sheetWrapper.appendChild(table); sheetWrapper.setAttribute('aria-hidden', 'false');
    if (sheetStatus) sheetStatus.textContent = `Showing ${Math.min(totalRows, start + 1)}–${Math.min(totalRows, start + pageRows.length)} of ${totalRows} members — Updated: ${new Date().toLocaleTimeString()}`;
    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (!paginationEl) return;
    paginationEl.innerHTML = '';
    function createBtn(label, disabled, cls) {
      const btn = document.createElement('button');
      btn.textContent = label;
      if (disabled) btn.setAttribute('disabled', 'true');
      if (cls) btn.classList.add(cls);
      return btn;
    }
    const prev = createBtn('Prev', currentPage === 1);
    prev.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderFixedSheetTable(); } });
    paginationEl.appendChild(prev);

    const pageWindow = 2;
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - pageWindow && i <= currentPage + pageWindow)) pages.push(i);
      else if (i === currentPage - pageWindow - 1 || i === currentPage + pageWindow + 1) pages.push('...');
    }
    let lastWasEllipsis = false;
    pages.forEach(i => {
      if (i === '...') {
        if (!lastWasEllipsis) {
          const el = document.createElement('span'); el.textContent = '...'; el.style.margin = "0 4px"; paginationEl.appendChild(el);
          lastWasEllipsis = true;
        }
      } else {
        const btn = createBtn(i, false, i === currentPage ? 'active' : '');
        btn.addEventListener('click', () => { currentPage = i; renderFixedSheetTable(); });
        paginationEl.appendChild(btn);
        lastWasEllipsis = false;
      }
    });

    const next = createBtn('Next', currentPage === totalPages);
    next.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; renderFixedSheetTable(); } });
    paginationEl.appendChild(next);
  }

  async function fetchAndRenderSheet() {
    if (!SHEET_ID || SHEET_ID.includes('YOUR')) {
      if (sheetStatus) sheetStatus.textContent = 'No SHEET_ID configured — open script and set SHEET_ID.';
      if (sheetWrapper) sheetWrapper.innerHTML = '';
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }
    if (sheetStatus) sheetStatus.textContent = 'Fetching latest data…';
    try {
      const res = await fetch(gvizUrl(SHEET_ID, SHEET_NAME));
      if (!res.ok) throw new Error(`Network response ${res.status}`);
      const text = await res.text();
      const json = parseGvizResponse(text);
      if (!json.table) throw new Error('No table data (is the sheet published/publicly visible?)');
      sheetRows = normalizeTable(json.table);
      currentPage = 1;
      renderFixedSheetTable();
    } catch (err) {
      if (sheetWrapper) sheetWrapper.innerHTML = `<div class="sheet-error">Error loading sheet: ${String(err)}</div>`;
      if (paginationEl) paginationEl.innerHTML = '';
      if (sheetStatus) sheetStatus.textContent = 'Failed to load data';
      console.error('Sheet fetch error', err);
    }
  }

  function gvizUrl(sheetId, sheetName) {
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const params = new URLSearchParams({ tqx: 'out:json', tq: 'select *' });
    if (sheetName) params.set('sheet', sheetName);
    return base + params.toString();
  }

  function parseGvizResponse(text) {
    const m = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
    if (!m) throw new Error('Unexpected sheet response format');
    return JSON.parse(m[1]);
  }

  /* Poll the roster while the section is visible to save requests */
  (function pollingWhileVisible() {
    let pollTimer = null;
    let isVisible = false;
    const liveSection = document.getElementById('live');
    if (!liveSection) { fetchAndRenderSheet(); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            fetchAndRenderSheet();
            if (pollTimer) clearInterval(pollTimer);
            pollTimer = setInterval(fetchAndRenderSheet, POLL_INTERVAL);
          }
        } else {
          if (isVisible) {
            isVisible = false;
            if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
          }
        }
      });
    }, { threshold: 0.25 });
    io.observe(liveSection);
  })();

  /* ---------- "View more" toggle (grid) ---------- */
  (function viewMoreGrid() {
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    const moreEvents = document.getElementById('moreEvents');
    const primaryGrid = document.getElementById('eventGrid');

    if (!viewMoreBtn || !moreEvents) return;

    function updateFewItemsFlag() {
      const count = moreEvents.querySelectorAll('.event-card').length;
      if (count < 4) moreEvents.classList.add('few-items');
      else moreEvents.classList.remove('few-items');
    }

    function expand() {
      moreEvents.classList.add('expanded');
      moreEvents.setAttribute('aria-hidden', 'false');
      viewMoreBtn.setAttribute('aria-expanded', 'true');
      viewMoreBtn.textContent = 'View less events';
      updateFewItemsFlag();

      // observe any reveal items inside
      const newReveals = moreEvents.querySelectorAll('.reveal');
      newReveals.forEach(r => { if (!r.classList.contains('visible')) obs.observe(r); });

      // ensure the expanded area comes into view
      setTimeout(() => {
        moreEvents.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }

    function collapse() {
      moreEvents.classList.remove('expanded');
      moreEvents.classList.remove('few-items');
      moreEvents.setAttribute('aria-hidden', 'true');
      viewMoreBtn.setAttribute('aria-expanded', 'false');
      viewMoreBtn.textContent = 'View more events';

      // bring user back to primary grid top
      if (primaryGrid) primaryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    viewMoreBtn.addEventListener('click', () => {
      const expanded = viewMoreBtn.getAttribute('aria-expanded') === 'true';
      if (!expanded) expand(); else collapse();
    });

    viewMoreBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); viewMoreBtn.click(); }
    });

    // Allow left/right arrow keyboard navigation between visible event cards for accessibility
    document.addEventListener('keydown', (e) => {
      const focusEl = document.activeElement;
      if (!focusEl) return;
      if (!focusEl.classList.contains('event-card') && !focusEl.closest('.event-card')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const all = Array.from(document.querySelectorAll('.event-card'));
        const current = all.findIndex(el => el === focusEl || el.contains(focusEl));
        if (current === -1) return;
        const nextIndex = e.key === 'ArrowRight' ? Math.min(all.length - 1, current + 1) : Math.max(0, current - 1);
        const next = all[nextIndex];
        if (next) next.focus({ preventScroll: false });
      }
    });

    // initial state
    moreEvents.setAttribute('aria-hidden', moreEvents.classList.contains('expanded') ? 'false' : 'true');
    updateFewItemsFlag();
  })();

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

