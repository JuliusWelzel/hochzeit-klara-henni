// Formular + Stadionticket auf <canvas>. Es wird nichts gesendet oder gespeichert.
import { MEALS, summarizeMeals, seatFor, slugify } from './ticket-core.js';

const C = {
  red: '#810100',
  maroon: '#630000',
  white: '#edebdd',
  ink: '#1b1717',
};
const F = {
  display: '"Anton", Impact, sans-serif',
  cond: '"Oswald", "Arial Narrow", sans-serif',
  serif: '"Source Serif 4", Georgia, serif',
};

const form = document.getElementById('ticket-form');
const peopleSel = document.getElementById('people');
const mealsBox = document.getElementById('meals');
const nameError = document.getElementById('name-error');
const ticketBox = document.getElementById('ticket');
const canvas = document.getElementById('ticket-canvas');
let current = null;

// ---------- Formular ----------
function renderMealFields() {
  const prev = [...mealsBox.querySelectorAll('select')].map(s => s.value);
  const n = Number(peopleSel.value);
  mealsBox.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const label = document.createElement('label');
    label.className = 'meal';
    const span = document.createElement('span');
    span.className = 'meal__who';
    span.textContent = n === 1 ? 'Du' : `Person ${i + 1}`;
    const sel = document.createElement('select');
    sel.className = 'field__input';
    sel.name = `meal-${i}`;
    for (const m of MEALS) sel.add(new Option(m, m));
    sel.value = prev[i] || MEALS[0];
    label.append(span, sel);
    mealsBox.append(label);
  }
}

function readForm() {
  const data = new FormData(form);
  return {
    name: String(data.get('name') || '').trim().replace(/\s+/g, ' '),
    people: Number(data.get('people')),
    meals: [...mealsBox.querySelectorAll('select')].map(s => s.value),
    allergies: String(data.get('allergies') || '').trim().replace(/\s+/g, ' '),
  };
}

// ---------- Zeichnen ----------
// Schriftgröße so weit verkleinern, bis der Text in maxWidth passt.
function fitFont(ctx, text, weight, family, size, minSize, maxWidth) {
  let s = size;
  ctx.font = `${weight} ${s}px ${family}`;
  while (s > minSize && ctx.measureText(text).width > maxWidth) {
    s -= 2;
    ctx.font = `${weight} ${s}px ${family}`;
  }
  return s;
}

// Text auf maxWidth kürzen und mit … abschließen.
function ellipsize(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) t = t.slice(0, -1);
  return t.trimEnd() + '…';
}

function spaced(ctx, text, x, y, spacing) {
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = `${spacing}px`;
    ctx.fillText(text, x, y);
    ctx.letterSpacing = '0px';
  } else {
    ctx.fillText(text, x, y);
  }
}

export function drawTicket(cv, { name, people, meals, allergies }) {
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const pad = 30;               // Rand um das Ticket
  const tear = 870;             // x der Abrisslinie
  const r = 22;                 // Radius der Kerben
  const left = pad, right = W - pad, top = pad, bottom = H - pad;

  // Hintergrund
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, 0, W, H);

  // Ticketform mit Kerben an der Abrisslinie
  const shape = new Path2D();
  shape.moveTo(left, top);
  shape.lineTo(tear - r, top);
  shape.arc(tear, top, r, Math.PI, 0, true);
  shape.lineTo(right, top);
  shape.lineTo(right, bottom);
  shape.lineTo(tear + r, bottom);
  shape.arc(tear, bottom, r, 0, Math.PI, true);
  shape.lineTo(left, bottom);
  shape.closePath();

  ctx.save();
  ctx.clip(shape);
  ctx.fillStyle = C.white;
  ctx.fillRect(left, top, tear - left, bottom - top);
  ctx.fillStyle = C.maroon;
  ctx.fillRect(tear, top, right - tear, bottom - top);

  // Kopfzeile
  ctx.fillStyle = C.red;
  ctx.fillRect(left, top, tear - left, 64);
  ctx.fillStyle = C.white;
  ctx.textBaseline = 'middle';
  ctx.font = `700 24px ${F.cond}`;
  spaced(ctx, '2FREUNDINNEN · HEIMSPIEL', left + 36, top + 33, 3);
  ctx.textAlign = 'right';
  spaced(ctx, 'SAISON 2027', tear - 40, top + 33, 3);
  ctx.textAlign = 'left';
  ctx.restore();

  const x = left + 36;
  const maxW = tear - x - 40;
  ctx.textBaseline = 'alphabetic';

  // Titel
  ctx.font = `400 104px ${F.display}`;
  ctx.fillStyle = C.ink;
  ctx.fillText('KLARA', x, top + 180);
  let tx = x + ctx.measureText('KLARA ').width;
  ctx.fillStyle = C.red;
  ctx.fillText('&', tx, top + 180);
  tx += ctx.measureText('& ').width;
  ctx.fillStyle = C.ink;
  ctx.fillText('HENNI', tx, top + 180);

  ctx.font = `500 25px ${F.cond}`;
  ctx.fillStyle = C.ink;
  spaced(ctx, 'FR 05.11.2027  ·  BAUER KAMMESHEIDT, ESSEN', x, top + 224, 1.5);

  // Trennlinie
  ctx.fillStyle = C.ink;
  ctx.fillRect(x, top + 250, maxW, 3);

  // Fan
  ctx.font = `700 17px ${F.cond}`;
  ctx.fillStyle = C.red;
  spaced(ctx, 'FAN', x, top + 285, 3);
  ctx.fillStyle = C.ink;
  fitFont(ctx, name.toUpperCase(), 400, F.display, 66, 30, maxW);
  ctx.fillText(ellipsize(ctx, name.toUpperCase(), maxW), x, top + 355);

  // Personen + Essen
  const line = `${people} ${people === 1 ? 'PERSON' : 'PERSONEN'}  ·  ${summarizeMeals(meals).toUpperCase()}`;
  fitFont(ctx, line, 500, F.cond, 26, 16, maxW);
  ctx.fillText(line, x, top + 397);

  if (allergies) {
    ctx.font = `italic 400 21px ${F.serif}`;
    ctx.fillStyle = C.red;
    ctx.fillText(ellipsize(ctx, `Hinweis: ${allergies}`, maxW), x, top + 433);
  }

  ctx.font = `500 15px ${F.cond}`;
  ctx.fillStyle = 'rgba(27,23,23,.6)';
  spaced(ctx, 'ANDENKEN · KEIN EINLASSNACHWEIS · 2FREUNDINNEN-HEIRATEN.DE', x, bottom - 26, 2);

  // Abrisslinie
  ctx.strokeStyle = C.white;
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(tear, top + r + 8);
  ctx.lineTo(tear, bottom - r - 8);
  ctx.stroke();
  ctx.setLineDash([]);

  // Abschnitt: Block / Reihe / Platz
  const seat = seatFor(name);
  const sx = tear + 38;
  const rows = [['BLOCK', seat.block], ['REIHE', seat.row], ['PLATZ', seat.seat]];
  rows.forEach(([label, value], i) => {
    const y = top + 58 + i * 92;
    ctx.fillStyle = C.white;
    ctx.globalAlpha = .75;
    ctx.font = `700 16px ${F.cond}`;
    spaced(ctx, label, sx, y, 3);
    ctx.globalAlpha = 1;
    ctx.font = `400 54px ${F.display}`;
    ctx.fillText(value, sx, y + 58);
  });

  // Barcode (aus dem Namen abgeleitet, nur Optik)
  const bx = sx, by = bottom - 108, bw = right - sx - 38, bh = 62;
  ctx.fillStyle = C.white;
  ctx.fillRect(bx - 8, by - 8, bw + 16, bh + 34);
  ctx.fillStyle = C.ink;
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  let px = bx;
  while (px < bx + bw) {
    h = (h * 1103515245 + 12345) >>> 0;
    const w = 1 + (h >>> 28) % 4;
    if (px + w > bx + bw) break;
    ctx.fillRect(px, by, w, bh);
    px += w + 1 + ((h >>> 24) % 3);
  }
  ctx.font = `500 13px ${F.cond}`;
  ctx.textAlign = 'center';
  spaced(ctx, `4 051127 ${seat.row}${seat.seat}27`, bx + bw / 2, by + bh + 20, 2);
  ctx.textAlign = 'left';
}

async function fontsReady() {
  try {
    await Promise.all([
      document.fonts.load(`400 104px ${F.display}`),
      document.fonts.load(`700 24px ${F.cond}`),
      document.fonts.load(`500 24px ${F.cond}`),
      document.fonts.load(`italic 400 21px ${F.serif}`),
    ]);
  } catch { /* Fallback-Schriften reichen */ }
}

// ---------- Speichern ----------
function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// PNG schon beim Zeichnen erzeugen: navigator.share muss direkt im Tipp laufen (iOS Safari).
function prepareFile(data) {
  return new Promise(res => canvas.toBlob(blob => {
    res(blob && new File([blob], `ticket-${slugify(data.name)}.png`, { type: 'image/png' }));
  }, 'image/png'));
}

function saveTicket() {
  const file = current && current.file;
  if (!file) return;
  const touch = window.matchMedia('(pointer: coarse)').matches;
  if (touch && navigator.canShare && navigator.canShare({ files: [file] })) {
    // Abbrechen (AbortError) ist ok; bei anderen Fehlern doch herunterladen.
    navigator.share({ files: [file], title: 'Ticket Klara & Henni' })
      .catch(e => { if (e.name !== 'AbortError') download(file, file.name); });
    return;
  }
  download(file, file.name);
}

// ---------- Ablauf ----------
form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = readForm();
  if (!data.name) {
    nameError.hidden = false;
    form.elements.name.setAttribute('aria-invalid', 'true');
    form.elements.name.focus();
    return;
  }
  nameError.hidden = true;
  form.elements.name.removeAttribute('aria-invalid');
  await fontsReady();
  drawTicket(canvas, data);
  data.file = await prepareFile(data);
  current = data;
  canvas.setAttribute('aria-label', `Ticket für ${data.name}, ${data.people} ${data.people === 1 ? 'Person' : 'Personen'}, ${summarizeMeals(data.meals)}`);
  form.hidden = true;
  ticketBox.hidden = false;
  ticketBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

form.elements.name.addEventListener('input', () => {
  if (form.elements.name.value.trim()) nameError.hidden = true;
});
peopleSel.addEventListener('change', renderMealFields);
document.getElementById('ticket-save').addEventListener('click', saveTicket);
document.getElementById('ticket-edit').addEventListener('click', () => {
  ticketBox.hidden = true;
  form.hidden = false;
  form.elements.name.focus();
});

renderMealFields();
