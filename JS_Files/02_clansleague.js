document.getElementById("year").textContent = new Date().getFullYear();

/* ===== CONFIG ===== */
const SHEET_ID = '1yclRtNsj-ARza8FQFgGZCb37--yIIp_2z4FeMITTPz4';

/* ===== SEASONS ===== */
const SEASONS = {
  current: {
    sheet: 'Leaderboards',
    startRow: 1,
    endRow: 9,
    headers: ['Clan Name', 'Total Points']
  },
  AverageDPG: {
    sheet: 'Leaderboards',
    startRow: 10,
    endRow: 18,
    headers: ['Clan Name', 'Average DPG']
  },
  AverageKPG: {
    sheet: 'Leaderboards',
    startRow: 20,
    endRow: 28,
    headers: ['Clan Name', 'Average KPG']
  }
};

/* ===== DIVISIONS (COLUMNS) ===== */
const DIVISIONS = {
  EU_ELITE: { clanCol: 'O', valueCol: 'P' },
  PLATINUM: { clanCol: 'K', valueCol: 'L' },
  EMERALD: { clanCol: 'G', valueCol: 'H' },
  IMMORTAL: { clanCol: 'C', valueCol: 'D' }
};

/* ===== STATE ===== */
let activeDivision = 'EU_ELITE';

/* ===== ELEMENTS ===== */
const sheetWrapper = document.getElementById('sheetWrapper');
const leagueStatusEl = document.getElementById('leagueStatus');
const seasonSelect = document.getElementById('leagueSeason');
const divisionSelect = document.getElementById('divisionSelect');

/* ===== HELPERS ===== */
function colLetterToIdx(letter) {
  let idx = 0;
  for (const c of letter.toUpperCase()) {
    idx = idx * 26 + (c.charCodeAt(0) - 64);
  }
  return idx - 1;
}

async function fetchSheet(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&tqx=out:json`;
  const res = await fetch(url);
  const text = await res.text();

  const json = JSON.parse(
    text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
  );

  return (json.table.rows || []).map(r =>
    r.c?.map(c => c?.f ?? c?.v ?? '') ?? []
  );
}

/* ===== MAIN RENDER ===== */
async function loadClansLeague() {
  try {
    leagueStatusEl.textContent = 'Loading...';
    sheetWrapper.innerHTML = '';

    const seasonKey = seasonSelect.value;
    const season = SEASONS[seasonKey];

    const allRows = await fetchSheet(season.sheet);
    const rows = allRows.slice(season.startRow - 1, season.endRow);

    const { clanCol, valueCol } = DIVISIONS[activeDivision];
    const clanIdx = colLetterToIdx(clanCol);
    const valueIdx = colLetterToIdx(valueCol);

    const table = document.createElement('table');
    table.className = 'live-table';

    table.innerHTML = `
      <thead>
        <tr>
          <th>${season.headers[0]}</th>
          <th>${season.headers[1]}</th>
        </tr>
      </thead>
    `;

    const tbody = document.createElement('tbody');

    rows.forEach(row => {
      if (!row[clanIdx]) return;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row[clanIdx]}</td>
        <td>${row[valueIdx] || '—'}</td>
      `;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    sheetWrapper.appendChild(table);

    leagueStatusEl.textContent =
      `${activeDivision.replace('_', ' ')} — ${seasonSelect.options[seasonSelect.selectedIndex].text}`;

  } catch (err) {
    console.error(err);
    leagueStatusEl.textContent = 'Failed to load data';
  }
}

/* ===== EVENTS ===== */
seasonSelect.addEventListener('change', loadClansLeague);
divisionSelect.addEventListener('change', () => {
  activeDivision = divisionSelect.value;
  loadClansLeague();
});

/* ===== INIT ===== */
loadClansLeague();
