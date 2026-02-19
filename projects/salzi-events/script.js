// ── EVENT DATA ────────────────────────────────────
// Kategorien: Bierzelt | Festival | Tradition | Sport | Konzert | Markt | Party | Kultur | Motorsport
const events = [
  {
    id: 1, title: "Ramsauer Bierzelt",
    dateStart: "2026-05-15", dateEnd: "2026-05-17",
    ort: "Bad Goisern", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.6433, lng: 13.6267
  },
  {
    id: 2, title: "Tutto Gas Lignano",
    dateStart: "2026-05-22", dateEnd: "2026-05-25",
    ort: "Lignano (IT)", kategorie: "Festival",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 45.6833, lng: 13.1167
  },
  {
    id: 3, title: "Narzissenfest Bad Aussee",
    dateStart: "2026-05-28", dateEnd: "2026-05-31",
    ort: "Bad Aussee", kategorie: "Tradition",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.narzissenfest.at", img: "",
    lat: 47.6161, lng: 13.7822
  },
  {
    id: 4, title: "Narzissennacht",
    dateStart: "2026-05-29", dateEnd: "2026-05-29",
    ort: "Bad Aussee", kategorie: "Tradition",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.6161, lng: 13.7822
  },
  {
    id: 5, title: "EWU Weltrekord",
    dateStart: "2026-05-30", dateEnd: "2026-05-30",
    ort: "Bad Goisern", kategorie: "Kultur",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.facebook.com/people/Ewu-Weltrekord-Bad-Goisern/61586949272277/", img: "",
    lat: 47.6433, lng: 13.6267
  },
  {
    id: 6, title: "Weindorf Bad Ischl",
    dateStart: "2026-06-03", dateEnd: "2026-06-06",
    ort: "Bad Ischl", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "https://badischl.salzkammergut.at/oesterreich-veranstaltung/detail/430021921/25-weindorf.html", img: "",
    lat: 47.7143, lng: 13.6217
  },
  {
    id: 7, title: "Untersee'r Zeltfest",
    dateStart: "2026-06-05", dateEnd: "2026-06-07",
    ort: "Bad Goisern", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.6350, lng: 13.6200
  },
  {
    id: 8, title: "Nova Rock Festival",
    dateStart: "2026-06-11", dateEnd: "2026-06-14",
    ort: "Nickelsdorf", kategorie: "Festival",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.novarock.at", img: "",
    lat: 47.9167, lng: 17.0500
  },
  {
    id: 9, title: "Weinfest Bad Goisern",
    dateStart: "2026-06-18", dateEnd: "2026-06-20",
    ort: "Bad Goisern", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.6433, lng: 13.6267
  },
  {
    id: 10, title: "Sulzbacher Straßenfest",
    dateStart: "2026-06-19", dateEnd: "2026-06-21",
    ort: "Bad Ischl", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.7143, lng: 13.6217
  },
  {
    id: 11, title: "Sommernacht St. Wolfgang",
    dateStart: "2026-06-22", dateEnd: "2026-06-22",
    ort: "St. Wolfgang", kategorie: "Kultur",
    desc_de: "", desc_en: "", highlight: false, website: "https://wolfgangsee.salzkammergut.at/veranstaltungen/veranstaltungshighlights/sommernacht.html", img: "",
    lat: 47.7369, lng: 13.4486
  },
  {
    id: 12, title: "Wirlinger Bierzelt",
    dateStart: "2026-06-26", dateEnd: "2026-06-28",
    ort: "Wirling", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.6300, lng: 13.6150
  },
  {
    id: 13, title: "Salzkammergut Nostalgia",
    dateStart: "2026-06-27", dateEnd: "2026-06-27",
    ort: "Bad Goisern", kategorie: "Motorsport",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.skgt-nostalgia.at/nostalgia-2026.html", img: "",
    lat: 47.6433, lng: 13.6267
  },
  {
    id: 14, title: "Woodstock der Blasmusik",
    dateStart: "2026-07-02", dateEnd: "2026-07-05",
    ort: "Ort im Innkreis", kategorie: "Konzert",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.woodstockderblasmusik.at/", img: "",
    lat: 48.1667, lng: 13.7167
  },
  {
    id: 15, title: "Donauinselfest",
    dateStart: "2026-07-03", dateEnd: "2026-07-05",
    ort: "Wien", kategorie: "Festival",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.donauinselfest.at", img: "",
    lat: 48.2082, lng: 16.3738
  },
  {
    id: 16, title: "Stadtfest Bad Ischl",
    dateStart: "2026-07-03", dateEnd: "2026-07-05",
    ort: "Bad Ischl", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "https://badischl.salzkammergut.at/stadtfest.html", img: "",
    lat: 47.7143, lng: 13.6217
  },
  {
    id: 17, title: "Sommernacht St. Wolfgang",
    dateStart: "2026-07-06", dateEnd: "2026-07-06",
    ort: "St. Wolfgang", kategorie: "Kultur",
    desc_de: "", desc_en: "", highlight: false, website: "https://wolfgangsee.salzkammergut.at/veranstaltungen/veranstaltungshighlights/sommernacht.html", img: "",
    lat: 47.7369, lng: 13.4486
  },
  {
    id: 18, title: "Sommernacht Bad Aussee",
    dateStart: "2026-07-07", dateEnd: "2026-07-07",
    ort: "Bad Aussee", kategorie: "Kultur",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.stadtmarketing-badaussee.at/ausseer-sommern%C3%A4chte", img: "",
    lat: 47.6161, lng: 13.7822
  },
  {
    id: 19, title: "Quattrolegende St. Gilgen",
    dateStart: "2026-07-08", dateEnd: "2026-07-11",
    ort: "St. Gilgen", kategorie: "Motorsport",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.quattrolegende.com/quattrolegende/", img: "",
    lat: 47.7683, lng: 13.3686
  },
  {
    id: 20, title: "Electric Love Festival",
    dateStart: "2026-07-09", dateEnd: "2026-07-11",
    ort: "Salzburg", kategorie: "Festival",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.electriclove.at", img: "",
    lat: 47.8095, lng: 13.0550
  },
  {
    id: 21, title: "Firefighter Caribbean Party Obertraun",
    dateStart: "2026-07-11", dateEnd: "2026-07-11",
    ort: "Obertraun", kategorie: "Party",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.ff-obertraun.at/aktuelles/news/artikel/5-firefighter-caribbean-party", img: "",
    lat: 47.5572, lng: 13.6722
  },
  {
    id: 22, title: "Strobler Wiesn",
    dateStart: "2026-07-16", dateEnd: "2026-07-19",
    ort: "Strobl", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.salzburgerland.com/de/events/veranstaltungen/SBG/7b8485bf-0433-44e1-b120-8e24dff5625b/53--strobler-wies-n", img: "",
    lat: 47.7183, lng: 13.4850
  },
  {
    id: 23, title: "Salzkammergut Trophy",
    dateStart: "2026-07-17", dateEnd: "2026-07-19",
    ort: "Bad Goisern", kategorie: "Sport",
    desc_de: "Die legendäre Salzkammergut Trophy ruft und verspricht auch dieses Jahr wieder Gänsehaut-Feeling pur. Freut euch auf spektakuläre Trails, grandioses Panorama und eine Stimmung, die Bad Goisern zum Beben bringt. Ein Pflichttermin für alle Bike-Fans!",
    desc_en: "The legendary Salzkammergut Trophy is calling – pure goosebumps guaranteed. Spectacular trails, breathtaking mountain scenery and an atmosphere that makes Bad Goisern shake. A must for every mountain bike fan!",
    highlight: true, website: "https://www.salzkammergut-trophy.at", img: "/projects/salzi-events/images/23.jpg",
    lat: 47.6433, lng: 13.6267
  },
  {
    id: 24, title: "Sommernacht St. Wolfgang",
    dateStart: "2026-07-20", dateEnd: "2026-07-20",
    ort: "St. Wolfgang", kategorie: "Kultur",
    desc_de: "", desc_en: "", highlight: false, website: "https://wolfgangsee.salzkammergut.at/veranstaltungen/veranstaltungshighlights/sommernacht.html", img: "",
    lat: 47.7369, lng: 13.4486
  },
  {
    id: 25, title: "Sommernacht Bad Aussee",
    dateStart: "2026-07-21", dateEnd: "2026-07-21",
    ort: "Bad Aussee", kategorie: "Kultur",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.stadtmarketing-badaussee.at/ausseer-sommern%C3%A4chte", img: "",
    lat: 47.6161, lng: 13.7822
  },
  {
    id: 26, title: "Kunstmue Festival",
    dateStart: "2026-07-24", dateEnd: "2026-07-25",
    ort: "Bad Goisern", kategorie: "Festival",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.kunstmue.at/", img: "",
    lat: 47.6433, lng: 13.6267
  },
  {
    id: 27, title: "Abersee'r Zeltfest",
    dateStart: "2026-07-24", dateEnd: "2026-07-26",
    ort: "Abersee", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.7350, lng: 13.4600
  },
  {
    id: 28, title: "Pernecker Kellerfest",
    dateStart: "2026-07-31", dateEnd: "2026-08-02",
    ort: "Bad Ischl", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.ff-badischl.at/aktuelle-beitraege/veranstaltungen/eventdetail/4/-/pernecker-kellerfest.html", img: "",
    lat: 47.7143, lng: 13.6217
  },
  {
    id: 29, title: "Beach Party Rußbach",
    dateStart: "2026-08-01", dateEnd: "2026-08-01",
    ort: "Rußbach", kategorie: "Party",
    desc_de: "", desc_en: "", highlight: false, website: "https://wolfgangsee.salzkammergut.at/oesterreich-veranstaltung/detail/430048883/beach-party-in-russach.html", img: "",
    lat: 47.5933, lng: 13.4433
  },
  {
    id: 30, title: "Sommernacht St. Wolfgang",
    dateStart: "2026-08-03", dateEnd: "2026-08-03",
    ort: "St. Wolfgang", kategorie: "Kultur",
    desc_de: "", desc_en: "", highlight: false, website: "https://wolfgangsee.salzkammergut.at/veranstaltungen/veranstaltungshighlights/sommernacht.html", img: "",
    lat: 47.7369, lng: 13.4486
  },
  {
    id: 31, title: "Sommernacht Bad Aussee",
    dateStart: "2026-08-04", dateEnd: "2026-08-04",
    ort: "Bad Aussee", kategorie: "Kultur",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.stadtmarketing-badaussee.at/ausseer-sommern%C3%A4chte", img: "",
    lat: 47.6161, lng: 13.7822
  },
  {
    id: 32, title: "Wolfganger Bierfest",
    dateStart: "2026-08-07", dateEnd: "2026-08-09",
    ort: "St. Wolfgang", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.7369, lng: 13.4486
  },
  {
    id: 33, title: "Seefest Grundlsee",
    dateStart: "2026-08-14", dateEnd: "2026-08-14",
    ort: "Grundlsee", kategorie: "Tradition",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.6267, lng: 13.8000
  },
  {
    id: 34, title: "Beach Volleyball Turnier Strandbad Untersee",
    dateStart: "2026-08-15", dateEnd: "2026-08-15",
    ort: "Bad Goisern", kategorie: "Sport",
    desc_de: "", desc_en: "", highlight: true, website: "https://bad-goisern.naturfreunde.at/events/angebot/3-naturfreunde-volleyballturnier-fuer-jedermann/", img: "/projects/salzi-events/images/34.jpg",
    lat: 47.6350, lng: 13.6200
  },
  {
    id: 35, title: "Berge in Flammen Altaussee",
    dateStart: "2026-08-15", dateEnd: "2026-08-15",
    ort: "Altaussee", kategorie: "Tradition",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.steiermark.com/de/Ausseerland-Salzkammergut/Urlaub-planen/Veranstaltungen/Berge-in-Flammen_ed_73611456", img: "",
    lat: 47.6411, lng: 13.7697
  },
  {
    id: 36, title: "Goisern Classic",
    dateStart: "2026-08-15", dateEnd: "2026-08-16",
    ort: "Bad Goisern", kategorie: "Motorsport",
    desc_de: "", desc_en: "", highlight: true, website: "https://www.goisern-classic.at/", img: "/projects/salzi-events/images/36.jpg",
    lat: 47.6433, lng: 13.6267
  },
  {
    id: 37, title: "Sommernacht St. Wolfgang",
    dateStart: "2026-08-17", dateEnd: "2026-08-17",
    ort: "St. Wolfgang", kategorie: "Kultur",
    desc_de: "", desc_en: "", highlight: false, website: "https://wolfgangsee.salzkammergut.at/veranstaltungen/veranstaltungshighlights/sommernacht.html", img: "",
    lat: 47.7369, lng: 13.4486
  },
  {
    id: 38, title: "Sommernacht Bad Aussee",
    dateStart: "2026-08-18", dateEnd: "2026-08-18",
    ort: "Bad Aussee", kategorie: "Kultur",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.stadtmarketing-badaussee.at/ausseer-sommern%C3%A4chte", img: "",
    lat: 47.6161, lng: 13.7822
  },
  {
    id: 39, title: "Frequency Festival",
    dateStart: "2026-08-20", dateEnd: "2026-08-22",
    ort: "St. Pölten", kategorie: "Festival",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.frequency.at", img: "",
    lat: 48.2047, lng: 15.6256
  },
  {
    id: 40, title: "Goiserer Gamsjagatage",
    dateStart: "2026-08-28", dateEnd: "2026-08-30",
    ort: "Bad Goisern", kategorie: "Tradition",
    desc_de: "", desc_en: "", highlight: false, website: "https://www.gamsjagatage.goisara.at/", img: "",
    lat: 47.6433, lng: 13.6267
  },
  {
    id: 41, title: "Pfandler Bierzelt",
    dateStart: "2026-08-28", dateEnd: "2026-08-30",
    ort: "Bad Goisern", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.6433, lng: 13.6267
  },
  {
    id: 42, title: "Altausseer Kiritog Bierzelt",
    dateStart: "2026-09-05", dateEnd: "2026-09-07",
    ort: "Altaussee", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.6411, lng: 13.7697
  },
  {
    id: 43, title: "Wolfgangsee Traktoria",
    dateStart: "2026-09-11", dateEnd: "2026-09-12",
    ort: "St. Wolfgang", kategorie: "Motorsport",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.7369, lng: 13.4486
  },
  {
    id: 44, title: "Oatna Kirtagsbierzelt",
    dateStart: "2026-09-26", dateEnd: "2026-09-28",
    ort: "Bad Goisern", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.6433, lng: 13.6267
  },
  {
    id: 45, title: "Liachtbradlmontag",
    dateStart: "2026-10-05", dateEnd: "2026-10-05",
    ort: "Bad Goisern", kategorie: "Tradition",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.6433, lng: 13.6267
  },
  {
    id: 46, title: "St. Wolfgang Kirtag",
    dateStart: "2026-10-31", dateEnd: "2026-10-31",
    ort: "St. Wolfgang", kategorie: "Bierzelt",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.7369, lng: 13.4486
  },
  {
    id: 47, title: "Krampuslauf Goisan",
    dateStart: "2026-12-07", dateEnd: "2026-12-07",
    ort: "Bad Goisern", kategorie: "Tradition",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.6433, lng: 13.6267
  },
  {
    id: 48, title: "Blaulichtparty FF Goisan",
    dateStart: "2026-09-05", dateEnd: "2026-09-05",
    ort: "Bad Goisern", kategorie: "Party",
    desc_de: "", desc_en: "", highlight: false, website: "", img: "",
    lat: 47.6433, lng: 13.6267
  }
];

// ── LANGUAGE ──────────────────────────────────────
let currentLang = 'de';

const TRANSLATIONS = {
  de: {
    eyebrow:          'Inneres Salzkammergut · 2026',
    h1_main:          'Wos geht im',
    h1_em:            'Soizkommerguad?',
    hero_sub:         'Oi Vaonstoitungen. Oi Festln. Ois auf oan Blick. Nema long umanond suachn.',
    hero_claim:       '„So vapss ma nix mehr" ✦',
    label_search:     '🔎 Suche',
    search_ph:        'z.B. Bierzelt, Goisern, Trophy …',
    label_ort:        '📍 Ort',
    label_kat:        '🎉 Kategorie',
    label_von:        '📅 Von',
    label_bis:        '📅 Bis',
    btn_filter:       'Filtern',
    all_orte:         'Alle Orte',
    all_kat:          'Alle Kategorien',
    filter_active:    'Filter aktiv – nicht alle Events werden angezeigt.',
    btn_reset_text:   'Zurücksetzen',
    highlights_title: 'Sommer-Highlights',
    hl_hide:          'Ausblenden',
    hl_show:          'Anzeigen',
    all_events_title: 'Alle Events',
    weekend_btn:      '🗓️ Dieses Wochenende',
    load_more:        'Mehr Events laden',
    empty_p:          'Keine Events für diese Filter gefunden. Versuch einen anderen Zeitraum oder Ort.',
    highlight_badge:  '★ Highlight',
    nav_btn:          '🧭 Navigation starten',
    website_btn:      '🔗 Zur offiziellen Website',
    share_btn:        '↗ Teilen',
    share_copied:     'Link kopiert!',
    footer_line1:     'A Projekt für die Region · Koa Verein, koa Werbung',
    footer_line2:     'Ongoben vom C.Lichtenegger & erstöd vom D.König',
    footer_line3:     'ohne Gewähr · Stand: Februar 2026',
    months:      ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
    months_long: ['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
    weekdays:    ['So','Mo','Di','Mi','Do','Fr','Sa'],
  },
  en: {
    eyebrow:          'Inner Salzkammergut · 2026',
    h1_main:          "What's on in the",
    h1_em:            'Salzkammergut?',
    hero_sub:         'All events. All festivals. One glance. No more hunting through Instagram & posters.',
    hero_claim:       '"Never miss a thing." ✦',
    label_search:     '🔎 Search',
    search_ph:        'e.g. festival, Goisern, Trophy …',
    label_ort:        '📍 Location',
    label_kat:        '🎉 Category',
    label_von:        '📅 From',
    label_bis:        '📅 To',
    btn_filter:       'Filter',
    all_orte:         'All locations',
    all_kat:          'All categories',
    filter_active:    'Filter active – not all events are shown.',
    btn_reset_text:   'Reset',
    highlights_title: 'Summer Highlights',
    hl_hide:          'Hide',
    hl_show:          'Show',
    all_events_title: 'All Events',
    weekend_btn:      '🗓️ This Weekend',
    load_more:        'Load more events',
    empty_p:          'No events found for these filters. Try a different date range or location.',
    highlight_badge:  '★ Highlight',
    nav_btn:          '🧭 Start navigation',
    website_btn:      '🔗 Official website',
    share_btn:        '↗ Share',
    share_copied:     'Link copied!',
    footer_line1:     'A project for the region · No club, no ads',
    footer_line2:     'Data by C.Lichtenegger & built by D.König',
    footer_line3:     'No guarantee · As of February 2026',
    months:      ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    months_long: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    weekdays:    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  }
};

function applyLang() {
  const t = TRANSLATIONS[currentLang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  document.querySelector('#filter-ort option[value=""]').textContent = t.all_orte;
  document.querySelector('#filter-kat option[value=""]').textContent = t.all_kat;

  document.getElementById('highlights-toggle-label').textContent =
    highlightsVisible ? t.hl_hide : t.hl_show;

  document.getElementById('lang-toggle').textContent = currentLang === 'de' ? '🇬🇧 EN' : '🇦🇹 DE';
  document.documentElement.lang = currentLang;

  renderHighlights();
  renderEvents();
}

function setLang(lang) {
  currentLang = lang;
  applyLang();
}

// ── HELPERS ───────────────────────────────────────
function parseDate(str) {
  return new Date(str + 'T00:00:00');
}

function formatShort(str) {
  const d = parseDate(str);
  const t = TRANSLATIONS[currentLang];
  return { day: d.getDate(), month: t.months[d.getMonth()], wd: t.weekdays[d.getDay()] };
}

function formatFull(str) {
  const d = parseDate(str);
  const t = TRANSLATIONS[currentLang];
  return `${t.weekdays[d.getDay()]}, ${d.getDate()}. ${t.months_long[d.getMonth()]} ${d.getFullYear()}`;
}

function formatRange(start, end) {
  if (start === end) return formatFull(start);
  const s = parseDate(start), e = parseDate(end);
  const t = TRANSLATIONS[currentLang];
  if (s.getMonth() === e.getMonth()) {
    return `${s.getDate()}. – ${e.getDate()}. ${t.months_long[s.getMonth()]} ${s.getFullYear()}`;
  }
  return `${s.getDate()}. ${t.months_long[s.getMonth()]} – ${e.getDate()}. ${t.months_long[e.getMonth()]} ${s.getFullYear()}`;
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
let filtered      = [...events];
let visibleCount  = PAGE_SIZE;
let weekendActive = false;
let currentEventId = null;

// ── WEEKEND SHORTCUT ──────────────────────────────
function getWeekendRange() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay(); // 0=Sun … 6=Sat
  // Stay on current Friday if Fri/Sat/Sun, otherwise jump to next Friday
  const daysToFri = day === 6 ? 6 : (5 - day + 7) % 7;
  const fri = new Date(today);
  fri.setDate(today.getDate() + daysToFri);
  const sun = new Date(fri);
  sun.setDate(fri.getDate() + 2);
  return {
    von: fri.toISOString().slice(0, 10),
    bis: sun.toISOString().slice(0, 10)
  };
}

function toggleWeekend() {
  weekendActive = !weekendActive;
  const btn = document.getElementById('weekend-btn');
  if (weekendActive) {
    const { von, bis } = getWeekendRange();
    document.getElementById('filter-von').value = von;
    document.getElementById('filter-bis').value = bis;
    btn.classList.add('active');
  } else {
    document.getElementById('filter-von').value = '';
    document.getElementById('filter-bis').value = '';
    btn.classList.remove('active');
  }
  applyFilters();
}

// ── RENDER HIGHLIGHTS ─────────────────────────────
function renderHighlights() {
  const grid = document.getElementById('highlights-grid');
  const highlights = events.filter(e => e.highlight);
  grid.innerHTML = highlights.map((e, i) => `
    <div class="highlight-card" style="animation-delay:${i * 0.08}s" onclick="openModal(${e.id})">
      <span class="highlight-badge">${TRANSLATIONS[currentLang].highlight_badge}</span>
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

  const list    = document.getElementById('event-list');
  const empty   = document.getElementById('empty-state');
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
    const d     = formatShort(e.dateStart);
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
          <p class="event-desc">${e[`desc_${currentLang}`] || e.desc_de || ''}</p>
        </div>
        <div class="event-arrow">›</div>
      </div>`;
  }).join('');

  if (filtered.length > visibleCount) {
    loadBtn.style.display = 'block';
    document.querySelector('.load-more').textContent = TRANSLATIONS[currentLang].load_more;
  } else {
    loadBtn.style.display = 'none';
  }
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

  document.getElementById('search-clear').style.display = search ? 'flex' : 'none';

  filtered = events.filter(e => {
    if (ort    && e.ort !== ort)       return false;
    if (kat    && e.kategorie !== kat) return false;
    if (von    && e.dateEnd < von)     return false;
    if (bis    && e.dateStart > bis)   return false;
    if (search) {
      const haystack = [e.title, e.ort, e.kategorie, e.desc_de, e.desc_en].join(' ').toLowerCase();
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
  ['filter-ort', 'filter-kat', 'filter-von', 'filter-bis', 'filter-search'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('search-clear').style.display = 'none';
  weekendActive = false;
  document.getElementById('weekend-btn').classList.remove('active');
  filtered = [...events];
  renderEvents(true);
  document.getElementById('filter-active-bar').style.display = 'none';
}

// ── MODAL ─────────────────────────────────────────
let leafletMap = null;

function openModal(id) {
  const e = events.find(ev => ev.id === id);
  if (!e) return;
  currentEventId = id;

  const t = TRANSLATIONS[currentLang];

  document.getElementById('modal-title').textContent = e.title;
  document.getElementById('modal-dates').textContent = formatRange(e.dateStart, e.dateEnd);
  document.getElementById('modal-ort').textContent   = e.ort;
  document.getElementById('modal-desc').textContent  = e[`desc_${currentLang}`] || e.desc_de || '';

  const tagEl = document.getElementById('modal-tag');
  tagEl.textContent = `${KAT_EMOJI[e.kategorie]} ${e.kategorie}`;
  tagEl.className   = `tag modal-tag ${TAG_CLASS[e.kategorie]}`;

  const imgWrap = document.getElementById('modal-img-wrap');
  if (e.img) {
    imgWrap.innerHTML     = `<img src="${e.img}" alt="${e.title}">`;
    imgWrap.style.display = 'block';
  } else {
    imgWrap.innerHTML     = `<div class="modal-img-placeholder">${KAT_EMOJI[e.kategorie]}</div>`;
    imgWrap.style.display = 'block';
  }

  const websiteBtn = document.getElementById('modal-website-btn');
  if (e.website) {
    websiteBtn.href          = e.website;
    websiteBtn.style.display = 'inline-flex';
    websiteBtn.textContent   = t.website_btn;
  } else {
    websiteBtn.style.display = 'none';
  }

  const highlightBadge = document.getElementById('modal-highlight-badge');
  highlightBadge.style.display = e.highlight ? 'inline-block' : 'none';
  highlightBadge.textContent   = t.highlight_badge;

  document.getElementById('modal-share-btn').textContent = t.share_btn;

  // ── MAP ──
  const navBtn = document.getElementById('modal-nav-btn');
  navBtn.textContent = t.nav_btn;

  if (e.lat && e.lng) {
    document.getElementById('modal-map-wrap').style.display = 'block';
    navBtn.href          = `https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}`;
    navBtn.style.display = 'inline-flex';

    if (leafletMap) { leafletMap.remove(); leafletMap = null; }

    setTimeout(() => {
      leafletMap = L.map('modal-map', { zoomControl: true, scrollWheelZoom: false })
        .setView([e.lat, e.lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(leafletMap);

      const pin = L.divIcon({
        className: '',
        html: `<div class="map-pin"><div class="map-pin-dot"></div></div>`,
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [0, -44]
      });

      L.marker([e.lat, e.lng], { icon: pin })
        .addTo(leafletMap)
        .bindPopup(`<strong>${e.title}</strong><br>${e.ort}`)
        .openPopup();
    }, 50);
  } else {
    document.getElementById('modal-map-wrap').style.display = 'none';
    navBtn.style.display = 'none';
  }

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  if (leafletMap) { leafletMap.remove(); leafletMap = null; }
}

// ── SHARE ─────────────────────────────────────────
async function shareEvent() {
  const e = events.find(ev => ev.id === currentEventId);
  if (!e) return;

  const t   = TRANSLATIONS[currentLang];
  const url = `${location.origin}${location.pathname}#event-${e.id}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `${e.title} – ${e.ort}`,
        text:  `${e.title} | ${formatRange(e.dateStart, e.dateEnd)} 🏔️`,
        url
      });
      return;
    } catch (err) {
      if (err.name === 'AbortError') return; // user cancelled, do nothing
    }
  }

  // Desktop fallback: copy URL to clipboard
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  showToast(t.share_copied);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ── POPULATE FILTER DROPDOWNS ─────────────────────
function populateFilters() {
  const orte   = [...new Set(events.map(e => e.ort))].sort();
  const ortSel = document.getElementById('filter-ort');
  orte.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o; opt.textContent = o;
    ortSel.appendChild(opt);
  });

  const kategorien = [...new Set(events.map(e => e.kategorie))].sort();
  const katSel     = document.getElementById('filter-kat');
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
  const t     = TRANSLATIONS[currentLang];

  highlightsVisible = !highlightsVisible;

  if (highlightsVisible) {
    grid.style.maxHeight     = grid.scrollHeight + 'px';
    grid.style.opacity       = '1';
    grid.style.pointerEvents = '';
    icon.textContent         = '▲';
    label.textContent        = t.hl_hide;
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
    label.textContent = t.hl_show;
    btn.setAttribute('aria-expanded', 'false');
  }
}

// ── INIT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateFilters();
  renderHighlights();
  renderEvents(true);

  document.getElementById('modal-overlay').addEventListener('click', function(ev) {
    if (ev.target === this) closeModal();
  });

  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') closeModal();
  });
});