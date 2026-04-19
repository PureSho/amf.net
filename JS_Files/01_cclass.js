document.addEventListener('DOMContentLoaded', () => {

  // =========================
  // DOM ELEMENTS (FIRST)
  // =========================
  const sheetWrapper = document.getElementById('otherSheetWrapper');
  const statusEl = document.getElementById('otherLeagueStatus');

    const squadsDivision = document.getElementById("division1");
    const duosDivision = document.getElementById("duosDivision");
    
    const duosDivisionSelect = document.getElementById("duosDivisionSelect");

  const seasonTypeSelect = document.getElementById("seasonTypeSelect");
  const squadsSeasons = document.getElementById("squadsSeasons");
  const duosSeasons = document.getElementById("duosSeasons");
  const squadsSeasonSelect = document.getElementById("squadsSeasonSelect");
  const duosSeasonSelect = document.getElementById("duosSeasonSelect");

  const divisionSelect1 = document.getElementById('divisionSelect1');
  const divisionSelect2 = document.getElementById('divisionSelect2');
  const toggle = document.getElementById('divisionToggle');
  
  // Map seasons to spreadsheet configs (all 17 seasons)
  const SEASON_CONFIG = {
    Season1: { sheetId: '1DoFRx6ziiRyqfkg_xvdAafSrWoVOwxUdV6E-rOfKA7o', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 14 },
        Defiance: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 31 },
        Tower: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 14 } } },
    Season2: { sheetId: '11DvaUr-MEZWvQvPDaIErEFY6Lg1rS-31wn8D44GtPLA', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 12 }, 
        Frontier: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 15 }, 
        Defiance: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 17 }, 
        Tower: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 14 } } },
    Season3: { sheetId: '1kTj5-apBTJ3lMCvHtoGoQAnmaLwrH6utTQ2fxO1sDTI', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 15 }, 
        Frontier: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 20 }, 
        Defiance: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 23 }, 
        Tower: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 12 } } },
    Season4: { sheetId: '1Bzap4IBSthEamxTgdHJdKYaHSRgkXOg4RIrVzcuXt-I', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AB', valueCol: 'AC', startRow: 1, endRow: 13 }, 
        Frontier: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 17 }, 
        Defiance: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 16 }, 
        Tower: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 13 }, 
        Kingdom: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 11 } } },
    Season5: { sheetId: '1J-VfoYvWnK_HG2L5IXbHFinf4t-LuPhRMkOQk_EadyU', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AB', valueCol: 'AC', startRow: 1, endRow: 17 }, 
        Frontier: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 20 }, 
        Defiance: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 29 }, 
        Tower: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 9 }, 
        Kingdom: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 12 } } },
    Season6: { sheetId: '10DUhmNs-G23gv9VI0X4Kf_PgEz5ekLXLa0gThRY5GAk', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AB', valueCol: 'AC', startRow: 1, endRow: 16 }, 
        Frontier: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 24 }, 
        Defiance: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 29 }, 
        Tower: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 20 }, 
        Kingdom: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 11 } } },
    Season7: { sheetId: '1Ry5Cs_AkO8t3M9ccOogh07c1ATGWBLqsbKiNDgOJCB8', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AB', valueCol: 'AC', startRow: 1, endRow: 17 }, 
        Frontier: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 25 }, 
        Defiance: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 26 }, 
        Tower: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 20 }, 
        Kingdom: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 12 } } },
    Season8: { sheetId: '1JhEJilZwMRXVGr4V_nJfJO4VkPKxlMlCYYsH8y219nM', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AB', valueCol: 'AC', startRow: 1, endRow: 20 }, 
        Frontier: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 26 }, 
        Defiance: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 33 }, 
        Tower: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 19 }, 
        Kingdom: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 13 } } },
    Season9: { sheetId: '191nwZ_DAqCBgpY_bmVi-LRNUj6lejBgdF2XiWsEtt5M', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AH', valueCol: 'AI', startRow: 1, endRow: 11 }, 
        Frontier: { clanCol: 'AB', valueCol: 'AC', startRow: 1, endRow: 21 }, 
        Defiance: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 24 }, 
        Metropolis: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 18 }, 
        Tower: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 20 }, 
        Kingdom: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 11 } } },
    Season10: { sheetId: '1oSRlH3EXllFlkvwuYdujyPI_7E2LfMamZ0TEbSn7raQ', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AH', valueCol: 'AI', startRow: 1, endRow: 9 }, 
        Frontier: { clanCol: 'AB', valueCol: 'AC', startRow: 1, endRow: 16 }, 
        Defiance: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 18 }, 
        Metropolis: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 19 }, 
        Tower: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 18 }, 
        Kingdom: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 12 } } },
    Season11: { sheetId: '1defJv7OTOYzUs18nLr69utn-tjKeQ4LO0A_cQ4HT7o4', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AH', valueCol: 'AI', startRow: 1, endRow: 12 }, 
        Frontier: { clanCol: 'AB', valueCol: 'AC', startRow: 1, endRow: 17 }, 
        Defiance: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 18 }, 
        Metropolis: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 20 }, 
        Tower: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 19 }, 
        Kingdom: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 12 } } },
    Season12: { sheetId: '1YQA26jOpus62ZRCbgIj57zPEZ-4zhkAIJ181y6kw-HM', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AH', valueCol: 'AI', startRow: 1, endRow: 15 }, 
        Frontier: { clanCol: 'AB', valueCol: 'AC', startRow: 1, endRow: 19 }, 
        Defiance: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 21 }, 
        Metropolis: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 19 }, 
        Tower: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 15 }, 
        Kingdom: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 14 } } },
    Season13: { sheetId: '1BRy6A6Q7cAxChO1-0smRgXNwGCghWSUnGhBVRzZxfEs', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AM', valueCol: 'AO', startRow: 1, endRow: 17 }, 
        Frontier: { clanCol: 'AF', valueCol: 'AH', startRow: 1, endRow: 20 }, 
        Defiance: { clanCol: 'Y', valueCol: 'AA', startRow: 1, endRow: 18 }, 
        Metropolis: { clanCol: 'R', valueCol: 'T', startRow: 1, endRow: 18 }, 
        Tower: { clanCol: 'K', valueCol: 'M', startRow: 1, endRow: 13 }, 
        Kingdom: { clanCol: 'D', valueCol: 'F', startRow: 1, endRow: 14 } } },
    Season14: { sheetId: '1V4kwrA2NPalQoeskSMWOC5WZ6aLHmLVg6Hxzuzvabhc', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AM', valueCol: 'AO', startRow: 1, endRow: 12 }, 
        Frontier: { clanCol: 'AF', valueCol: 'AH', startRow: 1, endRow: 19 }, 
        Defiance: { clanCol: 'Y', valueCol: 'AA', startRow: 1, endRow: 13 }, 
        Metropolis: { clanCol: 'R', valueCol: 'T', startRow: 1, endRow: 17 }, 
        Tower: { clanCol: 'K', valueCol: 'M', startRow: 1, endRow: 13 }, 
        Kingdom: { clanCol: 'D', valueCol: 'F', startRow: 1, endRow: 12 } } },
    Season15: { sheetId: '1aM3c6nxOBjnGY29Mp9KARi82SFPS-reQ9ZIar9SxteQ', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AM', valueCol: 'AO', startRow: 1, endRow: 12 }, 
        Frontier: { clanCol: 'AF', valueCol: 'AH', startRow: 1, endRow: 13 }, 
        Defiance: { clanCol: 'Y', valueCol: 'AA', startRow: 1, endRow: 16 }, 
        Metropolis: { clanCol: 'R', valueCol: 'T', startRow: 1, endRow: 15 }, 
        Tower: { clanCol: 'K', valueCol: 'M', startRow: 1, endRow: 14 }, 
        Kingdom: { clanCol: 'D', valueCol: 'F', startRow: 1, endRow: 14 } } },
    Season16: { sheetId: '1-n7tIg_jxbB6SYVA_oaJtU8q7cMtAlsB8loSXpzF0pM', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AM', valueCol: 'AO', startRow: 1, endRow: 11 }, 
        Frontier: { clanCol: 'AF', valueCol: 'AH', startRow: 1, endRow: 13 }, 
        Defiance: { clanCol: 'Y', valueCol: 'AA', startRow: 1, endRow: 20 }, 
        Metropolis: { clanCol: 'R', valueCol: 'T', startRow: 1, endRow: 12 }, 
        Tower: { clanCol: 'K', valueCol: 'M', startRow: 1, endRow: 14 }, 
        Kingdom: { clanCol: 'D', valueCol: 'F', startRow: 1, endRow: 13 } } },
    Season17: { sheetId: '1taoCxv1YdzljOIttNZgpb36gVB6xSfaLNvWgehD-ZK4', sheetName: 'Standings', divisions: { 
        Construction: { clanCol: 'AM', valueCol: 'AO', startRow: 1, endRow: 11 }, 
        Frontier: { clanCol: 'AF', valueCol: 'AH', startRow: 1, endRow: 18 }, 
        Defiance: { clanCol: 'Y', valueCol: 'AA', startRow: 1, endRow: 28 }, 
        Metropolis: { clanCol: 'R', valueCol: 'T', startRow: 1, endRow: 12 }, 
        Tower: { clanCol: 'K', valueCol: 'M', startRow: 1, endRow: 14 }, 
        Kingdom: { clanCol: 'D', valueCol: 'F', startRow: 1, endRow: 13 } } },

    DuosSeason1: { sheetId: '1QpoeT5x17fqCsCSP_io12rT88CepmrdJe0R0ossmGoE', sheetName: 'Standings', divisions: { 
        Uprising: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 12 }, 
        Seekers: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 16 }, 
        Bureau: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 24 },
        Phoenix: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 13 } } },
    DuosSeason2: { sheetId: '1LQm75lQ3iZxELBJDTa6-rwWjdyLjs9ntIu9gltDy-mY', sheetName: 'Standings', divisions: { 
        Uprising: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 10 }, 
        Seekers: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 21 }, 
        Bureau: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 19 },
        Phoenix: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 14 } } },
    DuosSeason3: { sheetId: '1CeoPtkIMezgRscwUl99ELeYRpxVd8o5Iy6SGFJAzJyo', sheetName: 'Standings', divisions: { 
        Uprising: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 14 }, 
        Seekers: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 15 }, 
        Bureau: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 22 },
        Phoenix: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 18 } } },
    DuosSeason4: { sheetId: '1Wd4IVet1Xj5tp35JDFYdXbxnIHqZCyO8wEuq94d7THY', sheetName: 'Standings', divisions: { 
        Uprising: { clanCol: 'V', valueCol: 'W', startRow: 1, endRow: 14 }, 
        Seekers: { clanCol: 'P', valueCol: 'Q', startRow: 1, endRow: 15 }, 
        Bureau: { clanCol: 'J', valueCol: 'K', startRow: 1, endRow: 22 },
        Phoenix: { clanCol: 'D', valueCol: 'E', startRow: 1, endRow: 15 } } },
    DuosSeason5: { sheetId: '1zRvI3tFbC-RChj1qZ3bgmZoHZExKKmQhsFo70QxORsQ', sheetName: 'Standings', divisions: { 
        Uprising: { clanCol: 'Y', valueCol: 'AB', startRow: 1, endRow: 17 }, 
        Seekers: { clanCol: 'R', valueCol: 'T', startRow: 1, endRow: 24 }, 
        Bureau: { clanCol: 'K', valueCol: 'M', startRow: 1, endRow: 24 },
        Phoenix: { clanCol: 'D', valueCol: 'F', startRow: 1, endRow: 13 } } },
    DuosSeason6: { sheetId: '16-wnmedmYnlcW97jwyH40lVAyd9jXImEmctb4xuQaPw', sheetName: 'Standings', divisions: { 
        Uprising: { clanCol: 'AG', valueCol: 'AI', startRow: 1, endRow: 20 }, 
        Seekers: { clanCol: 'Y', valueCol: 'AB', startRow: 1, endRow: 18 }, 
        Stronghold: { clanCol: 'R', valueCol: 'T', startRow: 1, endRow: 18 }, 
        Bureau: { clanCol: 'K', valueCol: 'M', startRow: 1, endRow: 18 },
        Phoenix: { clanCol: 'D', valueCol: 'F', startRow: 1, endRow: 14 } } },
    DuosSeason7: { sheetId: '19LZr0KfNjt44B2JUdWLukHszT7Enj17PBidQs64oAbw', sheetName: 'Standings', divisions: { 
        Uprising: { clanCol: 'AG', valueCol: 'AI', startRow: 1, endRow: 17 }, 
        Seekers: { clanCol: 'Y', valueCol: 'AB', startRow: 1, endRow: 18 }, 
        Stronghold: { clanCol: 'R', valueCol: 'T', startRow: 1, endRow: 16 }, 
        Bureau: { clanCol: 'K', valueCol: 'M', startRow: 1, endRow: 16 },
        Phoenix: { clanCol: 'D', valueCol: 'F', startRow: 1, endRow: 15 } } },
    DuosSeason8: { sheetId: '1MzH8Rjoq4Lrm8GfyZIMe73X8a2Rh6dxrwuauxoD5xVU', sheetName: 'Standings', divisions: { 
        Uprising: { clanCol: 'AG', valueCol: 'AI', startRow: 1, endRow: 14 }, 
        Seekers: { clanCol: 'Y', valueCol: 'AB', startRow: 1, endRow: 18 }, 
        Stronghold: { clanCol: 'R', valueCol: 'T', startRow: 1, endRow: 17 }, 
        Bureau: { clanCol: 'K', valueCol: 'M', startRow: 1, endRow: 16 },
        Phoenix: { clanCol: 'D', valueCol: 'F', startRow: 1, endRow: 16 } } },
    DuosSeason9: { sheetId: '1-3N7iPqQX1huDwbe96KS-O_G0SkJw0t1gCJn5OlyJY8', sheetName: 'Standings', divisions: { 
        Uprising: { clanCol: 'AG', valueCol: 'AI', startRow: 1, endRow: 14 }, 
        Seekers: { clanCol: 'Y', valueCol: 'AB', startRow: 1, endRow: 18 }, 
        Stronghold: { clanCol: 'R', valueCol: 'T', startRow: 1, endRow: 17 }, 
        Bureau: { clanCol: 'K', valueCol: 'M', startRow: 1, endRow: 16 },
        Phoenix: { clanCol: 'D', valueCol: 'F', startRow: 1, endRow: 16 } } },
};
  /* =========================
     HELPERS
  ========================= */
  function getActiveSeasonKey() {
    return seasonTypeSelect.value === "duos"
      ? duosSeasonSelect.value
      : squadsSeasonSelect.value;
  }
function getActiveDivision() {
  return seasonTypeSelect.value === "duos"
    ? duosDivisionSelect.value
    : divisionSelect1.value;
}


  async function fetchDivisionData(sheetId, clanCol, valueCol, startRow, endRow, sheetName) {
    try {
      const tq = `select ${clanCol},${valueCol} limit ${endRow - startRow + 1} offset ${startRow - 1}`;
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${sheetName}&tq=${encodeURIComponent(tq)}&tqx=out:json`;
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\((.*)\)/)[1]);

      return (json.table.rows || []).map(r => [
        r.c[0]?.f ?? r.c[0]?.v ?? '',
        r.c[1]?.f ?? r.c[1]?.v ?? ''
      ]);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  /* =========================
     RENDER
  ========================= */
  async function renderDivision(division) {
    try {
      sheetWrapper.innerHTML = '';
      statusEl.textContent = 'Loading...';

      const seasonKey = getActiveSeasonKey();
      const season = SEASON_CONFIG[seasonKey];
      if (!season) throw new Error('Season not found');

      const divisionData = season.divisions[division];
      if (!divisionData) throw new Error('Division not found');

      const rows = await fetchDivisionData(
        season.sheetId,
        divisionData.clanCol,
        divisionData.valueCol,
        divisionData.startRow,
        divisionData.endRow,
        season.sheetName
      );

      if (!rows.length) {
        statusEl.textContent = 'No data found';
        return;
      }

      const table = document.createElement('table');
      table.className = 'live-table';
      table.innerHTML = `<thead><tr><th>Team</th><th>Points</th></tr></thead>`;

      const tbody = document.createElement('tbody');
      rows.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r[0] || '—'}</td><td>${r[1] || '—'}</td>`;
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      sheetWrapper.appendChild(table);
      statusEl.textContent = `Showing: ${division} (${seasonKey})`;

    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Failed to load data';
    }
  }

  /* =========================
     EVENTS
  ========================= */
seasonTypeSelect.addEventListener("change", () => {
  // Hide everything first
  squadsSeasons.style.display = "none";
  duosSeasons.style.display = "none";
  squadsDivision.style.display = "none";
  duosDivision.style.display = "none";

  if (seasonTypeSelect.value === "duos") {
    duosSeasons.style.display = "block";
    duosDivision.style.display = "block";
  } else {
    squadsSeasons.style.display = "block";
    squadsDivision.style.display = "block";
  }

  renderDivision(getActiveDivision());
});


squadsSeasonSelect.addEventListener("change", () => {
  if (seasonTypeSelect.value === "squads") {
    renderDivision(getActiveDivision());
  }
});

duosSeasonSelect.addEventListener("change", () => {
  if (seasonTypeSelect.value === "duos") {
    renderDivision(getActiveDivision());
  }
});


duosDivisionSelect.addEventListener("change", () => {
  if (seasonTypeSelect.value === "duos") {
    renderDivision(duosDivisionSelect.value);
  }
});


divisionSelect1.addEventListener("change", () => {
  if (seasonTypeSelect.value === "squads") {
    renderDivision(divisionSelect1.value);
  }
});


  /* =========================
     DEFAULT STATE
  ========================= */

seasonTypeSelect.value = "squads";
squadsSeasonSelect.value = "SquadSZNs";
duosSeasonSelect.value = "DuosSZNs";

squadsSeasons.style.display = "block";
duosSeasons.style.display = "none";

renderDivision(divisionSelect1.value);

});
