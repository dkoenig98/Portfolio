// ── EVENT DATA ────────────────────────────────────
// Kategorien: Bierzelt | Festival | Tradition | Sport | Konzert | Markt | Party | Kultur | Motorsport
const events = [
  {
    id: 1, title: "Ramsauer Bierzelt",
    dateStart: "2026-05-15", dateEnd: "2026-05-17",
    ort: "Bad Goisern", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 2, title: "Tutto Gas Lignano",
    dateStart: "2026-05-22", dateEnd: "2026-05-25",
    ort: "Lignano (IT)", kategorie: "Festival",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 3, title: "Narzissenfest Bad Aussee",
    dateStart: "2026-05-28", dateEnd: "2026-05-31",
    ort: "Bad Aussee", kategorie: "Tradition",
    desc: "",
    highlight: false, website: "https://www.narzissenfest.at", img: ""
  },
  {
    id: 4, title: "Narzissennacht",
    dateStart: "2026-05-29", dateEnd: "2026-05-29",
    ort: "Bad Aussee", kategorie: "Tradition",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 5, title: "EWU Weltrekord",
    dateStart: "2026-05-30", dateEnd: "2026-05-30",
    ort: "Bad Goisern", kategorie: "Kultur",
    desc: "",
    highlight: false, website: "https://www.facebook.com/people/Ewu-Weltrekord-Bad-Goisern/61586949272277/", img: ""
  },
  {
    id: 6, title: "Weindorf Bad Ischl",
    dateStart: "2026-06-03", dateEnd: "2026-06-06",
    ort: "Bad Ischl", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "https://badischl.salzkammergut.at/oesterreich-veranstaltung/detail/430021921/25-weindorf.html", img: ""
  },
  {
    id: 7, title: "Untersee'r Zeltfest",
    dateStart: "2026-06-05", dateEnd: "2026-06-07",
    ort: "Bad Goisern", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 8, title: "Nova Rock Festival",
    dateStart: "2026-06-11", dateEnd: "2026-06-14",
    ort: "Nickelsdorf", kategorie: "Festival",
    desc: "",
    highlight: false, website: "https://www.novarock.at", img: ""
  },
  {
    id: 9, title: "Weinfest Bad Goisern",
    dateStart: "2026-06-18", dateEnd: "2026-06-20",
    ort: "Bad Goisern", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 10, title: "Sulzbacher Straßenfest",
    dateStart: "2026-06-19", dateEnd: "2026-06-21",
    ort: "Bad Ischl", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 11, title: "Sommernacht St. Wolfgang",
    dateStart: "2026-06-22", dateEnd: "2026-06-22",
    ort: "St. Wolfgang", kategorie: "Kultur",
    desc: "",
    highlight: false, website: "https://wolfgangsee.salzkammergut.at/veranstaltungen/veranstaltungshighlights/sommernacht.html", img: ""
  },
  {
    id: 12, title: "Wirlinger Bierzelt",
    dateStart: "2026-06-26", dateEnd: "2026-06-28",
    ort: "Wirling", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 13, title: "Salzkammergut Nostalgia",
    dateStart: "2026-06-27", dateEnd: "2026-06-27",
    ort: "Bad Goisern", kategorie: "Motorsport",
    desc: "",
    highlight: false, website: "https://www.skgt-nostalgia.at/nostalgia-2026.html", img: ""
  },
  {
    id: 14, title: "Woodstock der Blasmusik",
    dateStart: "2026-07-02", dateEnd: "2026-07-05",
    ort: "Ort im Innkreis", kategorie: "Konzert",
    desc: "",
    highlight: false, website: "https://www.woodstockderblasmusik.at/", img: ""
  },
  {
    id: 15, title: "Donauinselfest",
    dateStart: "2026-07-03", dateEnd: "2026-07-05",
    ort: "Wien", kategorie: "Festival",
    desc: "",
    highlight: false, website: "https://www.donauinselfest.at", img: ""
  },
  {
    id: 16, title: "Stadtfest Bad Ischl",
    dateStart: "2026-07-03", dateEnd: "2026-07-05",
    ort: "Bad Ischl", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "https://badischl.salzkammergut.at/stadtfest.html", img: ""
  },
  {
    id: 17, title: "Sommernacht St. Wolfgang",
    dateStart: "2026-07-06", dateEnd: "2026-07-06",
    ort: "St. Wolfgang", kategorie: "Kultur",
    desc: "",
    highlight: false, website: "https://wolfgangsee.salzkammergut.at/veranstaltungen/veranstaltungshighlights/sommernacht.html", img: ""
  },
  {
    id: 18, title: "Sommernacht Bad Aussee",
    dateStart: "2026-07-07", dateEnd: "2026-07-07",
    ort: "Bad Aussee", kategorie: "Kultur",
    desc: "",
    highlight: false, website: "https://www.stadtmarketing-badaussee.at/ausseer-sommern%C3%A4chte", img: ""
  },
  {
    id: 19, title: "Quattrolegende St. Gilgen",
    dateStart: "2026-07-08", dateEnd: "2026-07-11",
    ort: "St. Gilgen", kategorie: "Motorsport",
    desc: "",
    highlight: false, website: "https://www.quattrolegende.com/quattrolegende/", img: ""
  },
  {
    id: 20, title: "Electric Love Festival",
    dateStart: "2026-07-09", dateEnd: "2026-07-11",
    ort: "Salzburg", kategorie: "Festival",
    desc: "",
    highlight: false, website: "https://www.electriclove.at", img: ""
  },
  {
    id: 21, title: "Firefighter Caribbean Party Obertraun",
    dateStart: "2026-07-11", dateEnd: "2026-07-11",
    ort: "Obertraun", kategorie: "Party",
    desc: "",
    highlight: false, website: "https://www.ff-obertraun.at/aktuelles/news/artikel/5-firefighter-caribbean-party", img: ""
  },
  {
    id: 22, title: "Strobler Wiesn",
    dateStart: "2026-07-16", dateEnd: "2026-07-19",
    ort: "Strobl", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "https://www.salzburgerland.com/de/events/veranstaltungen/SBG/7b8485bf-0433-44e1-b120-8e24dff5625b/53--strobler-wies-n", img: ""
  },
  {
    id: 23, title: "Salzkammergut Trophy",
    dateStart: "2026-07-17", dateEnd: "2026-07-19",
    ort: "Bad Goisern", kategorie: "Sport",
    desc: "Die legendäre Salzkammergut Trophy ruft und verspricht auch dieses Jahr wieder Gänsehaut-Feeling pur. Freut euch auf spektakuläre Trails, grandioses Panorama und eine Stimmung, die Bad Goisern zum Beben bringt. Ein Pflichttermin für alle Bike-Fans!",
    highlight: true, website: "https://www.salzkammergut-trophy.at", img: "/projects/salzi-events/images/23.jpg"
  },
  {
    id: 24, title: "Sommernacht St. Wolfgang",
    dateStart: "2026-07-20", dateEnd: "2026-07-20",
    ort: "St. Wolfgang", kategorie: "Kultur",
    desc: "",
    highlight: false, website: "https://wolfgangsee.salzkammergut.at/veranstaltungen/veranstaltungshighlights/sommernacht.html", img: ""
  },
  {
    id: 25, title: "Sommernacht Bad Aussee",
    dateStart: "2026-07-21", dateEnd: "2026-07-21",
    ort: "Bad Aussee", kategorie: "Kultur",
    desc: "",
    highlight: false, website: "https://www.stadtmarketing-badaussee.at/ausseer-sommern%C3%A4chte", img: ""
  },
  {
    id: 26, title: "Kunstmue Festival",
    dateStart: "2026-07-24", dateEnd: "2026-07-25",
    ort: "Bad Goisern", kategorie: "Festival",
    desc: "",
    highlight: false, website: "https://www.kunstmue.at/", img: ""
  },
  {
    id: 27, title: "Abersee'r Zeltfest",
    dateStart: "2026-07-24", dateEnd: "2026-07-26",
    ort: "Abersee", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 28, title: "Pernecker Kellerfest",
    dateStart: "2026-07-31", dateEnd: "2026-08-02",
    ort: "Bad Ischl", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "https://www.ff-badischl.at/aktuelle-beitraege/veranstaltungen/eventdetail/4/-/pernecker-kellerfest.html", img: ""
  },
  {
    id: 29, title: "Beach Party Rußbach",
    dateStart: "2026-08-01", dateEnd: "2026-08-01",
    ort: "Rußbach", kategorie: "Party",
    desc: "",
    highlight: false, website: "https://wolfgangsee.salzkammergut.at/oesterreich-veranstaltung/detail/430048883/beach-party-in-russach.html", img: ""
  },
  {
    id: 30, title: "Sommernacht St. Wolfgang",
    dateStart: "2026-08-03", dateEnd: "2026-08-03",
    ort: "St. Wolfgang", kategorie: "Kultur",
    desc: "",
    highlight: false, website: "https://wolfgangsee.salzkammergut.at/veranstaltungen/veranstaltungshighlights/sommernacht.html", img: ""
  },
  {
    id: 31, title: "Sommernacht Bad Aussee",
    dateStart: "2026-08-04", dateEnd: "2026-08-04",
    ort: "Bad Aussee", kategorie: "Kultur",
    desc: "",
    highlight: false, website: "https://www.stadtmarketing-badaussee.at/ausseer-sommern%C3%A4chte", img: ""
  },
  {
    id: 32, title: "Wolfganger Bierfest",
    dateStart: "2026-08-07", dateEnd: "2026-08-09",
    ort: "St. Wolfgang", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 33, title: "Seefest Grundlsee",
    dateStart: "2026-08-14", dateEnd: "2026-08-14",
    ort: "Grundlsee", kategorie: "Tradition",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 34, title: "Beach Volleyball Turnier Strandbad Untersee",
    dateStart: "2026-08-15", dateEnd: "2026-08-15",
    ort: "Bad Goisern", kategorie: "Sport",
    desc: "",
    highlight: true, website: "https://bad-goisern.naturfreunde.at/events/angebot/3-naturfreunde-volleyballturnier-fuer-jedermann/", img: "/projects/salzi-events/images/34.jpg"
  },
  {
    id: 35, title: "Berge in Flammen Altaussee",
    dateStart: "2026-08-15", dateEnd: "2026-08-15",
    ort: "Altaussee", kategorie: "Tradition",
    desc: "",
    highlight: false, website: "https://www.steiermark.com/de/Ausseerland-Salzkammergut/Urlaub-planen/Veranstaltungen/Berge-in-Flammen_ed_73611456", img: ""
  },
  {
    id: 36, title: "Goisern Classic",
    dateStart: "2026-08-15", dateEnd: "2026-08-16",
    ort: "Bad Goisern", kategorie: "Motorsport",
    desc: "",
    highlight: true, website: "https://www.goisern-classic.at/", img: "/projects/salzi-events/images/36.jpg"
  },
  {
    id: 37, title: "Sommernacht St. Wolfgang",
    dateStart: "2026-08-17", dateEnd: "2026-08-17",
    ort: "St. Wolfgang", kategorie: "Kultur",
    desc: "",
    highlight: false, website: "https://wolfgangsee.salzkammergut.at/veranstaltungen/veranstaltungshighlights/sommernacht.html", img: ""
  },
  {
    id: 38, title: "Sommernacht Bad Aussee",
    dateStart: "2026-08-18", dateEnd: "2026-08-18",
    ort: "Bad Aussee", kategorie: "Kultur",
    desc: "",
    highlight: false, website: "https://www.stadtmarketing-badaussee.at/ausseer-sommern%C3%A4chte", img: ""
  },
  {
    id: 39, title: "Frequency Festival",
    dateStart: "2026-08-20", dateEnd: "2026-08-22",
    ort: "St. Pölten", kategorie: "Festival",
    desc: "",
    highlight: false, website: "https://www.frequency.at", img: ""
  },
  {
    id: 40, title: "Goiserer Gamsjagatage",
    dateStart: "2026-08-28", dateEnd: "2026-08-30",
    ort: "Bad Goisern", kategorie: "Tradition",
    desc: "",
    highlight: false, website: "https://www.gamsjagatage.goisara.at/", img: ""
  },
  {
    id: 41, title: "Pfandler Bierzelt",
    dateStart: "2026-08-28", dateEnd: "2026-08-30",
    ort: "Bad Goisern", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 42, title: "Altausseer Kiritog Bierzelt",
    dateStart: "2026-09-05", dateEnd: "2026-09-07",
    ort: "Altaussee", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 43, title: "Wolfgangsee Traktoria",
    dateStart: "2026-09-11", dateEnd: "2026-09-12",
    ort: "St. Wolfgang", kategorie: "Motorsport",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 44, title: "Oatna Kirtagsbierzelt",
    dateStart: "2026-09-26", dateEnd: "2026-09-28",
    ort: "Bad Goisern", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 45, title: "Liachtbradlmontag",
    dateStart: "2026-10-05", dateEnd: "2026-10-05",
    ort: "Bad Goisern", kategorie: "Tradition",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 46, title: "St. Wolfgang Kirtag",
    dateStart: "2026-10-31", dateEnd: "2026-10-31",
    ort: "St. Wolfgang", kategorie: "Bierzelt",
    desc: "",
    highlight: false, website: "", img: ""
  },
  {
    id: 47, title: "Krampuslauf Goisan",
    dateStart: "2026-12-07", dateEnd: "2026-12-07",
    ort: "Bad Goisern", kategorie: "Tradition",
    desc: "",
    highlight: false, website: "", img: ""
  }
];

// ── HELPERS ────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
const MONTHS_LONG = ['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const WEEKDAYS = ['So','Mo','Di','Mi','Do','Fr','Sa'];

function parseDate(str) {
  return new Date(str + 'T00:00:00');
}

function formatShort(str) {
  const d = parseDate(str);
  return { day: d.getDate(), month: MONTHS[d.getMonth()], wd: WEEKDAYS[d.getDay()] };
}

function formatFull(str) {
  const d = parseDate(str);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

function formatRange(start, end) {
  if (start === end) return formatFull(start);
  const s = parseDate(start), e = parseDate(end);
  if (s.getMonth() === e.getMonth()) {
    return `${s.getDate()}. – ${e.getDate()}. ${MONTHS_LONG[s.getMonth()]} ${s.getFullYear()}`;
  }
  return `${s.getDate()}. ${MONTHS_LONG[s.getMonth()]} – ${e.getDate()}. ${MONTHS_LONG[e.getMonth()]} ${s.getFullYear()}`;
}

function isMultiDay(e) { return e.dateStart !== e.dateEnd; }

const TAG_CLASS = {
  Bierzelt: 'tag-bierzelt', Festival: 'tag-festival', Tradition: 'tag-tradition',
  Sport: 'tag-sport', Konzert: 'tag-konzert', Markt: 'tag-markt',
  Party: 'tag-party', Kultur: 'tag-kultur', Motorsport: 'tag-motorsport'
};

const KAT_EMOJI = {
  Bierzelt: '🍺', Festival: '🎪', Tradition: '🏔️',
  Sport: '🚴', Konzert: '🎵', Markt: '🛍️',
  Party: '🎉', Kultur: '🎭', Motorsport: '🚗'
};

// ── STATE ─────────────────────────────────────────
const PAGE_SIZE = 8;
let filtered = [...events];
let visibleCount = PAGE_SIZE;

// ── RENDER HIGHLIGHTS ─────────────────────────────
function renderHighlights() {
  const grid = document.getElementById('highlights-grid');
  const highlights = events.filter(e => e.highlight);
  grid.innerHTML = highlights.map((e, i) => `
    <div class="highlight-card" style="animation-delay:${i * 0.08}s" onclick="openModal(${e.id})">
      <span class="highlight-badge">★ Highlight</span>
      <div class="hc-date">${formatRange(e.dateStart, e.dateEnd)}</div>
      <h3>${e.title}</h3>
      <div class="hc-meta">
        <span>📍 ${e.ort}</span>
        <span class="tag ${TAG_CLASS[e.kategorie]}">${KAT_EMOJI[e.kategorie]} ${e.kategorie}</span>
      </div>
    </div>
  `).join('');
}

// ── RENDER EVENT LIST ─────────────────────────────
function renderEvents(reset = false) {
  if (reset) visibleCount = PAGE_SIZE;

  const list = document.getElementById('event-list');
  const empty = document.getElementById('empty-state');
  const countEl = document.getElementById('event-count');
  const loadBtn = document.getElementById('load-more-wrap');

  countEl.textContent = `${filtered.length} Event${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    loadBtn.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  const slice = filtered.slice(0, visibleCount);

  list.innerHTML = slice.map(e => {
    const d = formatShort(e.dateStart);
    const multi = isMultiDay(e);
    return `
      <div class="event-card" onclick="openModal(${e.id})">
        <div class="event-date-block">
          <div class="edb-wd">${d.wd}</div>
          <div class="edb-day">${d.day}</div>
          <div class="edb-month">${d.month}</div>
          ${multi ? `<div class="edb-multi">+Tage</div>` : ''}
        </div>
        <div class="event-info">
          <div class="event-meta">
            <span class="tag ${TAG_CLASS[e.kategorie]}">${KAT_EMOJI[e.kategorie]} ${e.kategorie}</span>
            <span class="event-location">📍 ${e.ort}</span>
          </div>
          <h3>${e.title}</h3>
          <p class="event-desc">${e.desc}</p>
        </div>
        <div class="event-arrow">›</div>
      </div>`;
  }).join('');

  loadBtn.style.display = filtered.length > visibleCount ? 'block' : 'none';
}

function showMore() {
  visibleCount += PAGE_SIZE;
  renderEvents();
}

// ── FILTER ────────────────────────────────────────
function applyFilters() {
  const ort    = document.getElementById('filter-ort').value;
  const kat    = document.getElementById('filter-kat').value;
  const von    = document.getElementById('filter-von').value;
  const bis    = document.getElementById('filter-bis').value;
  const search = document.getElementById('filter-search').value.trim().toLowerCase();

  // Show/hide clear button on search field
  document.getElementById('search-clear').style.display = search ? 'flex' : 'none';

  filtered = events.filter(e => {
    if (ort && e.ort !== ort) return false;
    if (kat && e.kategorie !== kat) return false;
    if (von && e.dateEnd < von) return false;
    if (bis && e.dateStart > bis) return false;
    if (search) {
      const haystack = [e.title, e.ort, e.kategorie, e.desc].join(' ').toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  renderEvents(true);
  document.getElementById('filter-active-bar').style.display =
    (ort || kat || von || bis || search) ? 'flex' : 'none';
}

function clearSearch() {
  document.getElementById('filter-search').value = '';
  document.getElementById('search-clear').style.display = 'none';
  applyFilters();
  document.getElementById('filter-search').focus();
}

function resetFilters() {
  ['filter-ort','filter-kat','filter-von','filter-bis','filter-search'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('search-clear').style.display = 'none';
  filtered = [...events];
  renderEvents(true);
  document.getElementById('filter-active-bar').style.display = 'none';
}

// ── MODAL ─────────────────────────────────────────
function openModal(id) {
  const e = events.find(ev => ev.id === id);
  if (!e) return;

  document.getElementById('modal-title').textContent = e.title;
  document.getElementById('modal-dates').textContent = formatRange(e.dateStart, e.dateEnd);
  document.getElementById('modal-ort').textContent = e.ort;
  document.getElementById('modal-desc').textContent = e.desc;

  const tagEl = document.getElementById('modal-tag');
  tagEl.textContent = `${KAT_EMOJI[e.kategorie]} ${e.kategorie}`;
  tagEl.className = `tag modal-tag ${TAG_CLASS[e.kategorie]}`;

  const imgWrap = document.getElementById('modal-img-wrap');
  if (e.img) {
    imgWrap.innerHTML = `<img src="${e.img}" alt="${e.title}">`;
    imgWrap.style.display = 'block';
  } else {
    imgWrap.innerHTML = `<div class="modal-img-placeholder">${KAT_EMOJI[e.kategorie]}</div>`;
    imgWrap.style.display = 'block';
  }

  const websiteBtn = document.getElementById('modal-website-btn');
  if (e.website) {
    websiteBtn.href = e.website;
    websiteBtn.style.display = 'inline-flex';
    websiteBtn.textContent = '🔗 Zur offiziellen Website';
  } else {
    websiteBtn.style.display = 'none';
  }

  const highlightBadge = document.getElementById('modal-highlight-badge');
  highlightBadge.style.display = e.highlight ? 'inline-block' : 'none';

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── POPULATE FILTER DROPDOWNS ─────────────────────
function populateFilters() {
  const orte = [...new Set(events.map(e => e.ort))].sort();
  const ortSel = document.getElementById('filter-ort');
  orte.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o; opt.textContent = o;
    ortSel.appendChild(opt);
  });

  const kategorien = [...new Set(events.map(e => e.kategorie))].sort();
  const katSel = document.getElementById('filter-kat');
  kategorien.forEach(k => {
    const opt = document.createElement('option');
    opt.value = k; opt.textContent = `${KAT_EMOJI[k]} ${k}`;
    katSel.appendChild(opt);
  });
}

// ── HIGHLIGHTS TOGGLE ─────────────────────────────
let highlightsVisible = true;

function toggleHighlights() {
  const grid  = document.getElementById('highlights-grid');
  const icon  = document.getElementById('highlights-toggle-icon');
  const label = document.getElementById('highlights-toggle-label');
  const btn   = document.getElementById('highlights-toggle');

  highlightsVisible = !highlightsVisible;

  if (highlightsVisible) {
    grid.style.maxHeight     = grid.scrollHeight + 'px';
    grid.style.opacity       = '1';
    grid.style.pointerEvents = '';
    icon.textContent  = '▲';
    label.textContent = 'Ausblenden';
    btn.setAttribute('aria-expanded', 'true');
    setTimeout(() => { grid.style.maxHeight = 'none'; }, 380);
  } else {
    grid.style.maxHeight = grid.scrollHeight + 'px';
    requestAnimationFrame(() => {
      grid.style.maxHeight     = '0';
      grid.style.opacity       = '0';
      grid.style.pointerEvents = 'none';
    });
    icon.textContent  = '▼';
    label.textContent = 'Anzeigen';
    btn.setAttribute('aria-expanded', 'false');
  }
}

// ── INIT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateFilters();
  renderHighlights();
  renderEvents(true);

  // Close modal on overlay click
  document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});