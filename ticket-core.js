// Reine Logik fürs Stadionticket – ohne DOM, damit testbar.

export const MEALS = ['Fleisch', 'Vegetarisch', 'Vegan'];

export const EVENT = {
  date: '20271105',
  dateEnd: '20271106',
  title: 'Hochzeit Klara & Henni',
  location: 'Bauer Kammesheidt, Kamisheide 50, 45133 Essen',
  url: 'https://2freundinnen-heiraten.de',
};

// ["Vegan","Fleisch","Fleisch"] -> "2× Fleisch, 1× Vegan"
export function summarizeMeals(meals) {
  return MEALS
    .map(m => [m, meals.filter(x => x === m).length])
    .filter(([, n]) => n > 0)
    .map(([m, n]) => `${n}× ${m}`)
    .join(', ');
}

function hash(str) {
  let h = 2166136261;
  for (const ch of str) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

const pad = n => String(n).padStart(2, '0');

// Fester „Sitzplatz“ aus dem Namen – nur zum Spaß, kein echter Platz.
export function seatFor(name) {
  const h = hash(name.trim().toLowerCase());
  return {
    block: 'K&H',
    row: pad((h % 30) + 1),
    seat: pad((Math.floor(h / 30) % 40) + 1),
  };
}

// "Klara Müller" -> "klara-mueller"
export function slugify(name) {
  const s = name
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'gast';
}

const icsEscape = s => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

// Ganztägiger Termin, Uhrzeit steht noch nicht fest.
export function buildIcs() {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//2freundinnen-heiraten.de//Ticket//DE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:hochzeit-klara-henni-20271105@2freundinnen-heiraten.de',
    'DTSTAMP:20261124T000000Z',
    `DTSTART;VALUE=DATE:${EVENT.date}`,
    `DTEND;VALUE=DATE:${EVENT.dateEnd}`,
    `SUMMARY:${icsEscape(EVENT.title)}`,
    `LOCATION:${icsEscape(EVENT.location)}`,
    `DESCRIPTION:${icsEscape('Uhrzeit folgt – alle Infos: ' + EVENT.url)}`,
    `URL:${EVENT.url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}
