// ── Music theory ─────────────────────────────────────────────────────────────
// The staff has 5 lines. We use a unified "step" system where:
//   step = 0  → middle line (line 3)
//   each step = 1 note position (half a space in SVG)
//   positive steps go UP, negative go DOWN
//
// TREBLE CLEF – lines from bottom: E4, G4, B4, D5, F5
//   line1=E4 → step -4
//   line2=G4 → step -2
//   line3=B4 → step  0  (middle)
//   line4=D5 → step +2
//   line5=F5 → step +4
//
// BASS CLEF – lines from bottom: G2, B2, D3, F3, A3
//   line1=G2 → step -4
//   line2=B2 → step -2
//   line3=D3 → step  0  (middle)
//   line4=F3 → step +2
//   line5=A3 → step +4
//
// Each clef uses its OWN step mapping so the note lands on the correct line/space.

const NOTES_ES = ['Do','Re','Mi','Fa','Sol','La','Si'];
const NOTES_EN = ['C','D','E','F','G','A','B'];

// TREBLE CLEF note table
// Spaces (odd steps): F4=-3, A4=-1, C5=+1, E5=+3
// Ledger below: D4=-5(space), C4=-6(ledger line)
// Ledger above: G5=+5(space), A5=+6(ledger line)
const trebleNotes = [
  { name:'Do', octave:4, step:-6 },  // C4 – ledger line below staff
  { name:'Re', octave:4, step:-5 },  // D4 – space below ledger
  { name:'Mi', octave:4, step:-4 },  // E4 – line 1
  { name:'Fa', octave:4, step:-3 },  // F4 – space 1
  { name:'Sol',octave:4, step:-2 },  // G4 – line 2
  { name:'La', octave:4, step:-1 },  // A4 – space 2
  { name:'Si', octave:4, step: 0 },  // B4 – line 3 (middle)
  { name:'Do', octave:5, step: 1 },  // C5 – space 3
  { name:'Re', octave:5, step: 2 },  // D5 – line 4
  { name:'Mi', octave:5, step: 3 },  // E5 – space 4
  { name:'Fa', octave:5, step: 4 },  // F5 – line 5
  { name:'Sol',octave:5, step: 5 },  // G5 – space above staff
  { name:'La', octave:5, step: 6 },  // A5 – ledger line above
];

// BASS CLEF note table
// Lines from bottom: G2(step-4), B2(step-2), D3(step 0), F3(step+2), A3(step+4)
// Spaces: A2=-3, C3=-1, E3=+1, G3=+3
// Ledger below: F2=-6(ledger line), E2=-5(space below) — using G2 range instead:
//   Below line1 G2: F2=space step-5, E2=ledger step-6
// Ledger above A3: B3=space step+5, C4=ledger step+6
const bassNotes = [
  { name:'Mi', octave:2, step:-6 },  // E2 – ledger line below staff
  { name:'Fa', octave:2, step:-5 },  // F2 – space below ledger
  { name:'Sol',octave:2, step:-4 },  // G2 – line 1
  { name:'La', octave:2, step:-3 },  // A2 – space 1
  { name:'Si', octave:2, step:-2 },  // B2 – line 2
  { name:'Do', octave:3, step:-1 },  // C3 – space 2
  { name:'Re', octave:3, step: 0 },  // D3 – line 3 (middle)
  { name:'Mi', octave:3, step: 1 },  // E3 – space 3
  { name:'Fa', octave:3, step: 2 },  // F3 – line 4
  { name:'Sol',octave:3, step: 3 },  // G3 – space 4
  { name:'La', octave:3, step: 4 },  // A3 – line 5
  { name:'Si', octave:3, step: 5 },  // B3 – space above staff
  { name:'Do', octave:4, step: 6 },  // C4 – ledger line above
];

// ── State ────────────────────────────────────────────────────────────────────
let clef = 'treble';
let currentNote = null;
let score = { correct: 0, total: 0, streak: 0 };
let answered = false;

// ── SVG Drawing ──────────────────────────────────────────────────────────────
const SVG_NS = 'http://www.w3.org/2000/svg';
const W = 500, H = 220;
const STAFF_LEFT = 80, STAFF_RIGHT = 460;
const STAFF_MID_Y = 110;   // middle line Y
const SPACE = 14;          // pixels per step (half-space)
const NOTE_X = 280;
const NOTE_RX = 16, NOTE_RY = 11;

function stepToY(step) {
  // step 0 = middle line, positive = up
  return STAFF_MID_Y - step * SPACE;
}

function lineStep(lineNum) {
  // lineNum 1-5 from bottom
  // bottom line = step -4, next = -2, middle = 0, +2, top=+4
  return (lineNum - 3) * 2;
}

function drawStaff() {
  const svg = document.getElementById('staffSvg');
  svg.innerHTML = '';

  const ink = '#1a1612';
  const thin = '1.5';

  // 5 staff lines
  for (let i = 1; i <= 5; i++) {
    const y = stepToY(lineStep(i));
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', STAFF_LEFT);
    line.setAttribute('x2', STAFF_RIGHT);
    line.setAttribute('y1', y);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', ink);
    line.setAttribute('stroke-width', thin);
    svg.appendChild(line);
  }

  // Clef glyph
  drawClef(svg, ink);

  // Ledger lines if needed
  if (currentNote) drawLedgers(svg, ink);

  // Note
  if (currentNote) drawNote(svg);
}

function drawClef(svg, ink) {
  if (clef === 'treble') {
    // Treble clef SVG path (simplified)
    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('x', 22);
    t.setAttribute('y', stepToY(-2) + 8);
    t.setAttribute('font-size', '92');
    t.setAttribute('font-family', 'serif');
    t.setAttribute('fill', ink);
    t.setAttribute('dominant-baseline', 'middle');
    t.textContent = '𝄞';
    svg.appendChild(t);
  } else {
    // Bass clef: glyph's curl aligns to F3 = line 4 = step +2
    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('x', 18);
    t.setAttribute('y', stepToY(2) + 14);
    t.setAttribute('font-size', '72');
    t.setAttribute('font-family', 'serif');
    t.setAttribute('fill', ink);
    t.textContent = '𝄢';
    svg.appendChild(t);
  }
}

function drawLedgers(svg, ink) {
  const step = currentNote.step;
  const ledgerW = NOTE_RX * 2 + 8;
  const ledgerX1 = NOTE_X - ledgerW / 2;
  const ledgerX2 = NOTE_X + ledgerW / 2;

  // Below staff: line 1 = step -4. Ledger lines at even steps below -4
  if (step <= -5) {
    for (let s = -6; s >= step; s -= 2) {
      if (s % 2 === 0) { // on a line
        const y = stepToY(s);
        addLedger(svg, ledgerX1, ledgerX2, y, ink);
      }
    }
    // also -6 if step is -5 (note in space below ledger)
    if (step === -5) {
      addLedger(svg, ledgerX1, ledgerX2, stepToY(-6), ink);
    }
  }

  // Above staff: line 5 = step +4. Ledger lines at even steps above +4
  if (step >= 5) {
    for (let s = 6; s <= step; s += 2) {
      if (s % 2 === 0) {
        const y = stepToY(s);
        addLedger(svg, ledgerX1, ledgerX2, y, ink);
      }
    }
    if (step === 5) {
      addLedger(svg, ledgerX1, ledgerX2, stepToY(6), ink);
    }
  }

  // C4 in treble / C3 in bass is on ledger (step depends)
  // Middle C: treble step -6 = ledger below. Already handled above.
}

function addLedger(svg, x1, x2, y, ink) {
  const line = document.createElementNS(SVG_NS, 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('x2', x2);
  line.setAttribute('y1', y);
  line.setAttribute('y2', y);
  line.setAttribute('stroke', ink);
  line.setAttribute('stroke-width', '1.5');
  svg.appendChild(line);
}

function drawNote(svg) {
  const step = currentNote.step;
  const y = stepToY(step);

  // Note head (whole note = open ellipse)
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', 'note-anim');

  const ellipse = document.createElementNS(SVG_NS, 'ellipse');
  ellipse.setAttribute('cx', NOTE_X);
  ellipse.setAttribute('cy', y);
  ellipse.setAttribute('rx', NOTE_RX);
  ellipse.setAttribute('ry', NOTE_RY);
  ellipse.setAttribute('fill', 'none');
  ellipse.setAttribute('stroke', '#1a1612');
  ellipse.setAttribute('stroke-width', '2.5');

  // Inner hole for whole note feel
  const inner = document.createElementNS(SVG_NS, 'ellipse');
  inner.setAttribute('cx', NOTE_X);
  inner.setAttribute('cy', y);
  inner.setAttribute('rx', NOTE_RX - 5);
  inner.setAttribute('ry', NOTE_RY - 4);
  inner.setAttribute('fill', '#ede8dc');
  inner.setAttribute('stroke', 'none');
  inner.setAttribute('transform', `rotate(-15, ${NOTE_X}, ${y})`);

  g.appendChild(ellipse);
  g.appendChild(inner);
  svg.appendChild(g);
}

// ── Game logic ────────────────────────────────────────────────────────────────
function setClef(c) {
  clef = c;
  document.getElementById('btnTreble').classList.toggle('active', c === 'treble');
  document.getElementById('btnBass').classList.toggle('active', c === 'bass');
  nextNote();
}

function nextNote() {
  answered = false;
  hideFeedback();
  document.getElementById('posHint').textContent = '';

  const pool = clef === 'treble' ? trebleNotes : bassNotes;
  currentNote = pool[Math.floor(Math.random() * pool.length)];

  drawStaff();
}

function checkNote(chosen) {
  if (answered) return;
  answered = true;

  score.total++;
  document.getElementById('scTotal').textContent = score.total;

  const fb = document.getElementById('feedback');
  const fbIcon = document.getElementById('fbIcon');
  const fbText = document.getElementById('fbText');
  const fbCorrect = document.getElementById('fbCorrect');

  if (chosen === currentNote.name) {
    score.correct++;
    score.streak++;
    fb.className = 'feedback correct';
    fbIcon.textContent = '✓';
    fbText.textContent = '¡Correcto!';
    fbCorrect.textContent = currentNote.name + (currentNote.octave ? ' (oct. ' + currentNote.octave + ')' : '');
  } else {
    score.streak = 0;
    fb.className = 'feedback incorrect';
    fbIcon.textContent = '✗';
    fbText.textContent = 'Incorrecto';
    fbCorrect.textContent = 'La nota correcta era: ' + currentNote.name + ' (oct. ' + currentNote.octave + ')';
  }

  fb.classList.add('show');
  document.getElementById('scCorrect').textContent = score.correct;
  document.getElementById('scStreak').textContent = score.streak;

  // Show position hint
  const loc = currentNote.step % 2 === 0 ? 'línea' : 'espacio';
  document.getElementById('posHint').textContent =
    clef === 'treble' ? 'Clave de Sol' : 'Clave de Fa';
}

function hideFeedback() {
  const fb = document.getElementById('feedback');
  fb.className = 'feedback';
  fb.classList.remove('show');
}

function buildNoteButtons() {
  const grid = document.getElementById('noteGrid');
  grid.innerHTML = '';
  NOTES_ES.forEach(note => {
    const btn = document.createElement('button');
    btn.className = 'note-btn';
    btn.innerHTML = `<span>${note}</span>`;
    btn.onclick = () => checkNote(note);
    grid.appendChild(btn);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
buildNoteButtons();
nextNote();
